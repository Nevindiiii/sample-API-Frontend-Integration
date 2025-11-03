import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useNotificationStore } from './notificationStore';

export interface User {
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
  addUser: (user: User) => void;
  updateUser: (index: number, user: User) => void;
  deleteUser: (index: number) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      users: [],
      addUser: (user) => {
        set((state) => ({ users: [...state.users, user] }));
        useNotificationStore.getState().addNotification('add', `User ${user.name} added successfully`);
      },
      updateUser: (index, user) => {
        set((state) => ({
          users: state.users.map((u, i) => (i === index ? user : u)),
        }));
        useNotificationStore.getState().addNotification('update', `User ${user.name} updated successfully`);
      },
      deleteUser: (index) => {
        const userName = useUserStore.getState().users[index]?.name || 'User';
        set((state) => ({
          users: state.users.filter((_, i) => i !== index),
        }));
        useNotificationStore.getState().addNotification('delete', `User ${userName} deleted successfully`);
      },
    }),
    {
      name: 'user-storage',
    }
  )
);
