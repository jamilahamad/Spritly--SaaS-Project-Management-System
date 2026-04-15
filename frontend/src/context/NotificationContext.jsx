import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef
} from 'react';
import notificationService from '../services/notificationService';
import { AuthContext } from './AuthContext';

export const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const pollingRef = useRef(null);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      setLoading(true);
      const response = await notificationService.getNotifications(undefined, 50);
      const items = response.data || [];

      setNotifications(items);
      setUnreadCount(response.unreadCount ?? items.filter((n) => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);

      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }

      return;
    }

    fetchNotifications();

    pollingRef.current = setInterval(() => {
      fetchNotifications();
    }, 60000);

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isAuthenticated, fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      const response = await notificationService.markAsRead(notificationId);
      const updated = response.data;

      const existing = notifications.find((n) => n._id === notificationId);

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? updated : n))
      );

      if (existing && !existing.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      return { success: true };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return { success: false };
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);

      return { success: true };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return { success: false };
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);

      const target = notifications.find((n) => n._id === notificationId);

      setNotifications((prev) => prev.filter((n) => n._id !== notificationId));

      if (target && !target.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return { success: false };
    }
  };

  const clearAllNotifications = async () => {
    try {
      await notificationService.clearReadNotifications();

      setNotifications((prev) => prev.filter((n) => !n.read));
      setUnreadCount((prev) => Math.max(0, prev));

      return { success: true };
    } catch (error) {
      console.error('Error clearing notifications:', error);
      return { success: false };
    }
  };

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};