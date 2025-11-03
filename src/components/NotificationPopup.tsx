import { useNotificationStore } from '../store/notificationStore';
import { UserPlus, UserX, Edit, X } from 'lucide-react';

const getIcon = (type: 'add' | 'update' | 'delete') => {
  switch (type) {
    case 'add': return <UserPlus className="h-5 w-5 text-green-600" />;
    case 'update': return <Edit className="h-5 w-5 text-blue-600" />;
    case 'delete': return <UserX className="h-5 w-5 text-red-600" />;
  }
};

const getColor = (type: 'add' | 'update' | 'delete') => {
  switch (type) {
    case 'add': return 'border-l-green-500 bg-green-50';
    case 'update': return 'border-l-blue-500 bg-blue-50';
    case 'delete': return 'border-l-red-500 bg-red-50';
  }
};

export default function NotificationPopup() {
  const { notifications, showPopup, setShowPopup, markAsRead } = useNotificationStore();
  const latestNotification = notifications[0];

  if (!showPopup || !latestNotification) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className={`bg-white border-l-4 rounded-lg shadow-lg p-4 min-w-[320px] ${getColor(latestNotification.type)}`}>
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {getIcon(latestNotification.type)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {latestNotification.message}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {latestNotification.timestamp.toLocaleTimeString()}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowPopup(false);
              markAsRead(latestNotification.id);
            }}
            className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}