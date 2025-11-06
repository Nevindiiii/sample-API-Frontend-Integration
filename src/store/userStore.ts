import { create } from 'zustand';
import { useNotificationStore } from './notificationStore';
import * as userApi from '../apis/user';

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
      useNotificationStore.getState().addNotification('add', `User ${user.name} added successfully`);
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
      useNotificationStore.getState().addNotification('update', `User ${user.name} updated successfully`);
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  },
  
  deleteUser: async (id) => {
    const user = get().users.find(u => u._id === id);
    const userName = user?.name || 'User';
    try {
      await userApi.deleteUser(id);
      set((state) => ({
        users: state.users.filter((u) => u._id !== id),
      }));
      useNotificationStore.getState().addNotification('delete', `User ${userName} deleted successfully`);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  },
}))
