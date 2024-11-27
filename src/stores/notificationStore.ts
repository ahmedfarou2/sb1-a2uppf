import { create } from 'zustand';
import { UserNotification } from '../types/user';

interface NotificationStore {
  notifications: UserNotification[];
  unreadCount: number;
  
  addNotification: (notification: Omit<UserNotification, 'id' | 'createdAt'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: (userId: string) => void;
  getNotifications: (userId: string) => UserNotification[];
  getUnreadCount: (userId: string) => number;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const newNotification: UserNotification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (notificationId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      ),
      unreadCount: state.unreadCount - 1,
    }));
  },

  markAllAsRead: (userId) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.userId === userId ? { ...n, read: true } : n
      ),
      unreadCount: 0,
    }));
  },

  getNotifications: (userId) => {
    return get().notifications.filter((n) => n.userId === userId);
  },

  getUnreadCount: (userId) => {
    return get().notifications.filter((n) => n.userId === userId && !n.read).length;
  },
}));