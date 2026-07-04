import { useState, useEffect, useRef } from 'react';
import { Bell, X } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || API_BASE_URL;

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem('customer_token');
      if (!token) return;

      try {
        const response = await fetch(`${API_BASE_URL}/notifications/my-notifications`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setNotifications(data.notifications || []);
          setUnreadCount(data.unreadCount || 0);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // ✅ Close on ESC
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  const markAsRead = async (id: string) => {
    const token = localStorage.getItem('customer_token');
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    const token = localStorage.getItem('customer_token');
    if (!token) return;

    try {
      await fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const diff = new Date().getTime() - date.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hours ago`;
    return `${days} days ago`;
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-100 text-blue-700';
      case 'return':
        return 'bg-orange-100 text-orange-700';
      case 'refund':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'return':
        return '🔄';
      case 'refund':
        return '💰';
      default:
        return '🔔';
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* 🔔 Bell Button - Count remains exactly as your original code */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="relative text-primary-foreground/80 hover:text-primary-foreground p-1"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-[10px] rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* ✅ Responsive Panel */}
      {isOpen && (
        <div className="
          /* Desktop & Mobile Positioning */
          absolute right-0 mt-2 z-50 bg-white rounded-lg shadow-xl border 
          /* Mobile: Width adjust to screen, max-width to prevent overflow */
          w-[calc(100vw-2rem)] md:w-96 
          /* Prevent panel from going off-screen on very small devices */
          max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:top-25 max-sm:w-auto
        ">
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b bg-gray-50">
            <h3 className="font-semibold">Notifications</h3>
            <button onClick={() => setIsOpen(false)}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Mark all */}
          {unreadCount > 0 && (
            <div className="px-4 py-2 border-b">
              <button
                onClick={markAllAsRead}
                className="text-sm text-primary hover:underline"
              >
                Mark all as read
              </button>
            </div>
          )}

          {/* List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif._id}
                  onClick={() => markAsRead(notif._id)}
                  className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${
                    !notif.isRead ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${getTypeStyles(
                        notif.type
                      )}`}
                    >
                      {getTypeIcon(notif.type)}
                    </div>

                    <div className="flex-1">
                      <p className="text-sm font-medium">{notif.title}</p>
                      <p className="text-xs text-gray-500">
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTime(notif.createdAt)}
                      </p>
                    </div>

                    {!notif.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;