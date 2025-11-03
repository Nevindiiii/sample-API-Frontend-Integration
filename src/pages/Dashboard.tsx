import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Users, 
  TrendingUp, 
  DollarSign,
  Activity,
  Calendar,
  Search,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { fetchCarts } from '@/apis/cart';
import { useUserStore } from '@/store/userStore';
import { useMemo, useState, useEffect } from 'react';

const StatCard = ({ title, value, icon: Icon, trend, color }: {
  title: string;
  value: string;
  icon: any;
  trend?: string;
  color: string;
}) => (
  <Card className="relative overflow-hidden">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      {trend && (
        <p className="text-xs text-gray-500 mt-1">{trend}</p>
      )}
    </CardContent>
  </Card>
);

const ActivityChart = ({ cartData, users }: { cartData: any[], users: any[] }) => {
  const chartData = useMemo(() => {
    if (cartData.length === 0) {
      return [{ range: 'No Data', count: 0, height: 20 }];
    }
    
    // Group cart items by price ranges for visualization
    const priceRanges = [0, 50, 100, 200, 500];
    const maxCount = Math.max(1, cartData.length);
    
    const data = priceRanges.map((range, i) => {
      const nextRange = priceRanges[i + 1] || Infinity;
      const count = cartData.filter(item => item.price >= range && item.price < nextRange).length;
      const height = count > 0 ? Math.max(20, (count / maxCount) * 80) : 10;
      return { 
        range: i === priceRanges.length - 1 ? `$${range}+` : `$${range}-${priceRanges[i + 1] - 1}`, 
        count, 
        height 
      };
    });
    return data;
  }, [cartData]);

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Price Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-end justify-between space-x-2">
          {chartData.map((item, i) => (
            <div key={i} className="flex flex-col items-center space-y-2 flex-1">
              <div className="text-xs text-gray-600 mb-1">{item.count}</div>
              <div 
                className={`w-full rounded-t transition-all duration-300 ${
                  i % 3 === 0 ? 'bg-blue-500' : i % 3 === 1 ? 'bg-orange-500' : 'bg-green-500'
                }`}
                style={{ height: `${item.height}px`, minHeight: '10px' }}
                title={`${item.count} items in ${item.range} range`}
              />
              <span className="text-xs text-gray-500 text-center">{item.range}</span>
            </div>
          ))}
        </div>
        {cartData.length > 0 && (
          <div className="mt-4 text-sm text-gray-600 text-center">
            Total Items: {cartData.length} | Price Range: ${Math.min(...cartData.map(item => item.price)).toFixed(2)} - ${Math.max(...cartData.map(item => item.price)).toFixed(2)}
          </div>
        )}
        <div className="flex justify-center space-x-6 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Low Price</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Mid Price</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">High Price</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RecentActivity = ({ activities }: { activities: any[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-semibold">System Activity</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      {activities.length > 0 ? activities.map((activity, i) => (
        <div key={i} className="flex items-center space-x-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.color}`}>
            <Activity className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">{activity.user}</p>
            <p className="text-xs text-gray-500">{activity.action}</p>
          </div>
          <span className="text-xs text-gray-400">{activity.time}</span>
        </div>
      )) : (
        <div className="text-center py-8 text-gray-500">
          <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activity</p>
        </div>
      )}
    </CardContent>
  </Card>
);

export default function Dashboard() {
  const { data: cartData = [], isLoading: cartsLoading } = useQuery({ 
    queryKey: ['carts'], 
    queryFn: fetchCarts 
  });
  const { users } = useUserStore();
  const [showDateNotification, setShowDateNotification] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState(new Date());

  const handleTodayClick = () => {
    setShowDateNotification(true);
    setTimeout(() => setShowDateNotification(false), 3000);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setHasNewNotifications(false);
  };

  // Auto-refresh notifications every 2 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdateTime(new Date());
      setHasNewNotifications(true);
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, []);

  const notifications = useMemo(() => {
    const now = new Date();
    const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
    
    const notificationList = [];
    
    // Recent cart additions (last 2 minutes simulation)
    cartData.slice(0, 3).forEach((item, index) => {
      notificationList.push({
        id: `cart-${index}`,
        type: 'cart',
        title: 'New Cart Item',
        message: `${item.title} added - $${item.price}`,
        time: new Date(now.getTime() - (index + 1) * 30000).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        icon: '🛒',
        color: 'bg-blue-100 text-blue-600'
      });
    });
    
    // Recent user activities
    users.slice(0, 2).forEach((user, index) => {
      notificationList.push({
        id: `user-${index}`,
        type: 'user',
        title: user.isActive ? 'User Active' : 'User Inactive',
        message: `${user.name} from ${user.department}`,
        time: new Date(now.getTime() - (index + 4) * 45000).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        icon: user.isActive ? '✅' : '❌',
        color: user.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      });
    });
    
    // System notifications
    notificationList.push({
      id: 'system-1',
      type: 'system',
      title: 'System Update',
      message: `Dashboard refreshed at ${lastUpdateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })}`,
      time: lastUpdateTime.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }),
      icon: '🔄',
      color: 'bg-purple-100 text-purple-600'
    });
    
    return notificationList.slice(0, 5); // Show last 5 notifications
  }, [cartData, users, lastUpdateTime]);

  const stats = useMemo(() => {
    const totalItems = cartData.length;
    const totalUsers = users.length;
    const activeUsers = users.filter(user => user.isActive).length;
    const totalRevenue = cartData.reduce((sum, item) => sum + item.total, 0);
    const avgOrderValue = totalItems > 0 ? totalRevenue / totalItems : 0;

    return {
      totalItems,
      totalUsers,
      activeUsers,
      totalRevenue,
      avgOrderValue
    };
  }, [cartData, users]);

  const recentActivity = useMemo(() => {
    const activities = [];
    
    // Recent cart additions
    cartData.slice(0, 2).forEach(item => {
      activities.push({
        user: item.title,
        action: `Added to cart - $${item.price}`,
        time: 'Recently',
        color: 'bg-blue-100 text-blue-600'
      });
    });
    
    // Recent user registrations
    users.slice(0, 2).forEach(user => {
      activities.push({
        user: user.name,
        action: `${user.isActive ? 'Active user' : 'Inactive user'} - ${user.department}`,
        time: 'Recently',
        color: user.isActive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
      });
    });
    
    return activities.slice(0, 4);
  }, [cartData, users]);

  if (cartsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            <Button variant="outline" size="sm" onClick={handleNotificationClick} className="relative">
              <Bell className="h-4 w-4" />
              {hasNewNotifications && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              )}
            </Button>
            <Button variant="outline" size="sm" onClick={handleTodayClick}>
              <Calendar className="h-4 w-4 mr-2" />
              Today
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Cart Items"
          value={stats.totalItems.toString()}
          icon={ShoppingCart}
          trend={`${stats.totalItems} items in system`}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toString()}
          icon={Users}
          trend={`${stats.activeUsers} active users`}
          color="bg-green-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          trend={`Avg: $${stats.avgOrderValue.toFixed(2)} per item`}
          color="bg-orange-500"
        />
        <StatCard
          title="Active Rate"
          value={`${stats.totalUsers > 0 ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}%`}
          icon={TrendingUp}
          trend={`${stats.activeUsers}/${stats.totalUsers} users active`}
          color="bg-purple-500"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ActivityChart cartData={cartData} users={users} />
        <RecentActivity activities={recentActivity} />
      </div>

      {/* Date Notification Popup */}
      {showDateNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 min-w-[280px]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Today's Date</h4>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Popup */}
      {showNotifications && (
        <div className="fixed top-16 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg w-80 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setShowNotifications(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Notifications List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${notification.color} flex-shrink-0`}>
                        <span className="text-sm">{notification.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No notifications</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-3 bg-gray-50 text-center">
              <p className="text-xs text-gray-500">
                Last updated: {lastUpdateTime.toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}