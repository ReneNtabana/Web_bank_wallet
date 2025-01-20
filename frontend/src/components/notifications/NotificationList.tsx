import { useState, useEffect } from 'react';
import { Notification, notificationService } from '../../services/notification.service';

interface NotificationListProps {
  onClose?: () => void;
}

const NotificationList = ({ onClose }: NotificationListProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => 
        n._id === id ? { ...n, read: true } : n
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center">Loading notifications...</div>;
  }

  return (
    <div className="max-h-[400px] overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          No notifications at this time
        </div>
      ) : (
        <ul className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <li
              key={notification._id}
              className={`p-4 hover:bg-gray-50 ${
                notification.read ? 'bg-gray-50' : 'bg-white'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {!notification.read && (
                  <button
                    onClick={() => handleMarkAsRead(notification._id)}
                    className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList; 