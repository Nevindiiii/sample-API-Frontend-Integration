import { Link, useLocation } from 'react-router-dom';
import { 
  Users,
  ShoppingCart, 
  BarChart3, 
  Settings, 
  Home,
  Calendar,
  FileText
} from 'lucide-react';
import { useNotificationStore } from '../store/notificationStore';

const NAV_ITEMS = [
  { path: '/', icon: ShoppingCart, label: 'Cart Items' },
  { path: '/add-user', icon: Users, label: 'Users' },
  { path: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/reports', icon: FileText, label: 'Reports' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

export default function Navigation() {
  const location = useLocation();
  const { unreadCount } = useNotificationStore();

  return (
    <nav className="fixed left-0 top-0 h-full w-16 bg-white border-r border-gray-200 shadow-sm z-50">
      <div className="flex flex-col items-center py-6 space-y-4">
        {/* Logo */}
        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mb-4">
          <Home className="w-5 h-5 text-white" />
        </div>
        
        {/* Navigation Items */}
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:bg-gray-100 ${
                isActive 
                  ? 'bg-blue-50 text-blue-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              title={label}
            >
              <Icon className="w-5 h-5" />
              
              {/* Notification indicator for Dashboard */}
              {path === '/dashboard' && unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
              
              {/* Tooltip */}
              <div className="absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                {label}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45"></div>
              </div>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -right-4 w-1 h-6 bg-black rounded-l-full"></div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
