// import { create } from 'zustand';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import * as userApi from '../apis/user';

// export interface User {
//   _id?: string;
//   name: string;
//   email: string;
//   gender: string;
//   department: string;
//   phone: string;
//   isActive: boolean;
//   startDate: string;
// }

// interface UserStore {
//   users: User[];
//   loading: boolean;
//   fetchUsers: () => Promise<void>;
//   addUser: (user: User) => Promise<void>;
//   updateUser: (id: string, user: User) => Promise<void>;
//   deleteUser: (id: string) => Promise<void>;
// }

// export const useUserStore = create<UserStore>()((set, get) => ({
//   users: [],
//   loading: false,
  
//   fetchUsers: async () => {
//     set({ loading: true });
//     try {
//       const users = await userApi.fetchUsers();
//       set({ users, loading: false });
//     } catch (error) {
//       set({ loading: false });
//       console.error('Failed to fetch users:', error);
//     }
//   },
  
//   addUser: async (user) => {
//     try {
//       const newUser = await userApi.addUser(user);
//       set((state) => ({ users: [...state.users, newUser] }));
//     } catch (error) {
//       console.error('Failed to add user:', error);
//     }
//   },
  
//   updateUser: async (id, user) => {
//     try {
//       const updatedUser = await userApi.updateUser(id, user);
//       set((state) => ({
//         users: state.users.map((u) => (u._id === id ? { ...updatedUser, _id: id } : u)),
//       }));
//     } catch (error) {
//       console.error('Failed to update user:', error);
//     }
//   },
  
//   deleteUser: async (id) => {
//     const user = get().users.find((u) => u._id === id);
//     if (!user) return;
//     const deletedUser = user;
    
//     await userApi.deleteUser(id, user.name, async () => {
//       try {
//         const response = await axios.delete(`http://localhost:5000/api/users/${id}`);
//         set((state) => ({
//           users: state.users.filter((u) => u._id !== id),
//         }));
        
//         // Show undo message with same style
//         let countdown = 5;
//         let undoClicked = false;
        
//         const undoToastId = toast(
//           `${response.data.toast?.message || 'User deleted'} | 🔄 UNDO (${countdown}s)`,
//           {
//             duration: 5000,
//             style: {
//               background: '#f59e0b',
//               color: '#fff',
//               fontWeight: 'bold',
//               cursor: 'pointer',
//               border: '2px solid #d97706',
//               padding: '16px',
//             },
//             onClick: () => {
//               if (!undoClicked) {
//                 undoClicked = true;
//                 toast.dismiss(undoToastId);
//                 set((state) => ({ users: [...state.users, deletedUser] }));
//                 toast.success('✅ User deletion cancelled');
//               }
//             },
//           }
//         );

//         const interval = setInterval(() => {
//           countdown--;
//           if (countdown > 0 && !undoClicked) {
//             toast(
//               `${response.data.toast?.message || 'User deleted'} | 🔄 UNDO (${countdown}s)`,
//               { 
//                 id: undoToastId,
//                 duration: 5000,
//                 style: {
//                   background: '#f59e0b',
//                   color: '#fff',
//                   fontWeight: 'bold',
//                   cursor: 'pointer',
//                   border: '2px solid #d97706',
//                   padding: '16px',
//                 },
//               }
//             );
//           } else {
//             clearInterval(interval);
//           }
//         }, 1000);
//       } catch (error) {
//         console.error('Failed to delete user:', error);
//         toast.error('Failed to delete user');
//       }
//     });
//   },
// }))
import { create } from 'zustand';
import * as userApi from '../apis/user';
import { useNotificationStore } from './notificationStore';


export interface User {
  _id?: string;
  name: string;
  email: string;
  gender: string;
  department: string;
  phone: string;
  isActive: boolean;
  startDate: string;
}

interface UserStore {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
  addUser: (user: User) => Promise<void>;
  updateUser: (id: string, user: User) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

export const useUserStore = create<UserStore>()((set, get) => ({
  users: [],
  loading: false,
  
  fetchUsers: async () => {
    set({ loading: true });
    try {
      const users = await userApi.fetchUsers();
      set({ users, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch users:', error);
    }
  },
  
  addUser: async (user) => {
    try {
      const newUser = await userApi.addUser(user);
      set((state) => ({ users: [...state.users, newUser] }));
      useNotificationStore.getState().addNotification('add', `User "${user.name}" added successfully`);
    } catch (error) {
      console.error('Failed to add user:', error);
    }
  },
  
  updateUser: async (id, user) => {
    try {
      const updatedUser = await userApi.updateUser(id, user);
      set((state) => ({
        users: state.users.map((u) => (u._id === id ? { ...updatedUser, _id: id } : u)),
      }));
      useNotificationStore.getState().addNotification('update', `User "${user.name}" updated successfully`);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  },
  
  deleteUser: async (id) => {
    const user = get().users.find(u => u._id === id);
    const userName = user?.name || 'User';
    
    try {
      await userApi.deleteUser(id, userName, async () => {
        const response = await fetch(`http://localhost:5000/api/users/${id}`, { method: 'DELETE' });
        
        set((state) => ({
          users: state.users.filter((u) => u._id !== id),
        }));
        
        useNotificationStore.getState().addNotification('delete', `User "${userName}" deleted successfully`);
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  },
}))