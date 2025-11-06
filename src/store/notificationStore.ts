import { create } from 'zustand';
import toast from 'react-hot-toast';
import * as notificationApi from '../apis/notification';
import { Notification } from '../apis/notification';

interface NotificationStore {
  notifications: Notification[];
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  addNotification: (type: 'add' | 'update' | 'delete', message: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearAllNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>()((set, get) => ({
  notifications: [],
  loading: false,
  
  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const notifications = await notificationApi.fetchNotifications();
      set({ notifications, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch notifications:', error);
    }
  },
  
  addNotification: async (type, message) => {
    const notification = {
      type,
      message,
      timestamp: new Date(),
      read: false,
    };
    
    try {
      const newNotification = await notificationApi.addNotification(notification);
      set((state) => ({
        notifications: [newNotification, ...state.notifications],
      }));
      
      if (type === 'add') toast.success(message);
      else if (type === 'delete') toast.error(message);
      else toast(message);
    } catch (error) {
      console.error('Failed to add notification:', error);
    }
  },
  
  markAsRead: async (id) => {
    try {
      await notificationApi.updateNotification(id, { read: true });
      set((state) => ({
        notifications: state.notifications.map((n) => 
          n._id === id ? { ...n, read: true } : n
        ),
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },
  
  deleteNotification: async (id) => {
    try {
      await notificationApi.deleteNotification(id);
      set((state) => ({
        notifications: state.notifications.filter((n) => n._id !== id),
      }));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  },
  
  markAllAsRead: async () => {
    const { notifications } = get();
    try {
      await Promise.all(
        notifications.filter(n => !n.read).map(n => 
          notificationApi.updateNotification(n._id!, { read: true })
        )
      );
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
      }));
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  },
  
  clearAllNotifications: async () => {
    try {
      await notificationApi.clearAllNotifications();
      set({ notifications: [] });
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  },
}))