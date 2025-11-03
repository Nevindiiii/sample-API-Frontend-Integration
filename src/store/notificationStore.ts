import { create } from 'zustand';

export interface Notification {
  id: string;
  type: 'add' | 'update' | 'delete';
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  showPopup: boolean;
  addNotification: (type: 'add' | 'update' | 'delete', message: string) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  setShowPopup: (show: boolean) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>()((set, get) => ({
  notifications: [],
  unreadCount: 0,
  showPopup: false,
  
  addNotification: (type, message) => {
    const notification: Notification = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      read: false,
    };
    
    set((state) => ({
      notifications: [notification, ...state.notifications.slice(0, 9)], // Keep only 10 notifications
      unreadCount: state.unreadCount + 1,
      showPopup: true,
    }));
    
    // Auto hide popup after 4 seconds
    setTimeout(() => {
      set({ showPopup: false });
    }, 4000);
  },
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1),
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0,
  })),
  
  setShowPopup: (show) => set({ showPopup: show }),
  
  clearNotifications: () => set({
    notifications: [],
    unreadCount: 0,
    showPopup: false,
  }),
}));