// import React, { useState } from 'react';
// import { useData } from './DataContext';
// import { useAuth } from './AuthContext';
// import { Button } from './ui/button';
// import { Card, CardContent } from './ui/card';
// import { Badge } from './ui/badge';
// import { Separator } from './ui/separator';
// import { 
//   Bell, 
//   X, 
//   MessageSquare, 
//   UserPlus, 
//   Tag,
//   Dashboard,
//   ExternalLink,
//   Check,
//   CheckCheck
// } from './icons/Icons';

// export function NotificationBar() {
//   const { user } = useAuth();
//   const { 
//     getUserNotifications, 
//     markNotificationAsRead, 
//     markAllNotificationsAsRead,
//     getUnreadCount 
//   } = useData();
  
//   const [isOpen, setIsOpen] = useState(false);
//   const notifications = getUserNotifications();
//   const unreadCount = getUnreadCount();

//   if (!user || unreadCount === 0) {
//     return null;
//   }

//   const getNotificationIcon = (type) => {
//     switch (type) {
//       case 'comment':
//         return <MessageSquare className="h-4 w-4 text-blue-600" />;
//       case 'tag':
//         return <Tag className="h-4 w-4 text-orange-600" />;
//       case 'access_granted':
//         return <UserPlus className="h-4 w-4 text-green-600" />;
//       case 'new_dashboard':
//         return <Dashboard className="h-4 w-4 text-purple-600" />;
//       default:
//         return <Bell className="h-4 w-4 text-gray-600" />;
//     }
//   };

//   const handleNotificationClick = (notification) => {
//     if (!notification.isRead) {
//       markNotificationAsRead(notification.id);
//     }
//     if (notification.dashboardId) {
//       (window ).navigate('view-dashboard', { id: notification.dashboardId });
//     }
//     setIsOpen(false);
//   };

//   const formatTimeAgo = (dateString) => {
//     const now = new Date();
//     const date = new Date(dateString);
//     const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
//     if (diffInMinutes < 1) return 'Just now';
//     if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
//     if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
//     return `${Math.floor(diffInMinutes / 1440)}d ago`;
//   };

//   if (!isOpen) {
//     return (
//       <div className="fixed top-4 right-4 z-50">
//         <Button
//           onClick={() => setIsOpen(true)}
//           className="bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
//           size="sm"
//         >
//           <Bell className="h-4 w-4 mr-2" />
//           {unreadCount} new notification{unreadCount !== 1 ? 's' : ''}
//           <Badge variant="destructive" className="ml-2 px-1.5 py-0.5 text-xs">
//             {unreadCount}
//           </Badge>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed top-4 right-4 z-50 w-96">
//       <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
//         <CardContent className="p-0">
//           {/* Header */}
//           <div className="p-4 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <Bell className="h-5 w-5 text-primary" />
//                 <h3 className="font-medium text-gray-900">Notifications</h3>
//                 <Badge variant="secondary" className="px-2 py-1 text-xs">
//                   {unreadCount} new
//                 </Badge>
//               </div>
//               <div className="flex items-center space-x-2">
//                 {unreadCount > 0 && (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={markAllNotificationsAsRead}
//                     className="text-xs h-7 px-2"
//                   >
//                     <CheckCheck className="h-3 w-3 mr-1" />
//                     Mark all read
//                   </Button>
//                 )}
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setIsOpen(false)}
//                   className="h-7 w-7 p-0"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Notifications List */}
//           <div className="max-h-96 overflow-y-auto">
//             {notifications.length === 0 ? (
//               <div className="p-6 text-center text-gray-500">
//                 <Bell className="h-8 w-8 mx-auto mb-2 text-gray-400" />
//                 <p className="text-sm">No notifications yet</p>
//               </div>
//             ) : (
//               <div className="divide-y divide-gray-100">
//                 {notifications.slice(0, 10).map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
//                       !notification.isRead ? 'bg-blue-50/50' : ''
//                     }`}
//                     onClick={() => handleNotificationClick(notification)}
//                   >
//                     <div className="flex items-start space-x-3">
//                       <div className="flex-shrink-0 mt-0.5">
//                         {getNotificationIcon(notification.type)}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-center justify-between">
//                           <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
//                             {notification.title}
//                           </p>
//                           {!notification.isRead && (
//                             <div className="flex-shrink-0">
//                               <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
//                             </div>
//                           )}
//                         </div>
//                         <p className="text-xs text-gray-600 mt-1">
//                           {notification.message}
//                         </p>
//                         <div className="flex items-center justify-between mt-2">
//                           <span className="text-xs text-gray-500">
//                             {formatTimeAgo(notification.createdAt)}
//                           </span>
//                           {notification.dashboardId && (
//                             <Button
//                               variant="ghost"
//                               size="sm"
//                               className="h-6 px-2 text-xs text-primary hover:text-primary/80"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleNotificationClick(notification);
//                               }}
//                             >
//                               <ExternalLink className="h-3 w-3 mr-1" />
//                               View
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {notifications.length > 10 && (
//             <div className="p-3 border-t border-gray-100 text-center">
//               <Button variant="ghost" size="sm" className="text-xs text-gray-600">
//                 View all notifications
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
// NotificationBar.jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Bell, ExternalLink } from './icons/Icons';

export function NotificationBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const socket = io('http://localhost:5000/notifications', {
      auth: { token: localStorage.getItem('accessToken') },
    });

    socket.on('new_notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => socket.disconnect();
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  if (!user || unreadCount === 0) return null;

  const handleClick = (notification) => {
    setNotifications((prev) =>
      prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
    );
    if (notification.dashboard) {
      navigate(`/dashboard/${notification.dashboard}`);
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="bg-primary text-white shadow-md"
          size="sm"
        >
          <Bell className="h-4 w-4 mr-2" />
          {unreadCount} new notification{unreadCount > 1 ? 's' : ''}
        </Button>
      ) : (
        <Card className="w-80 shadow-lg">
          <CardContent className="p-3">
            {notifications.slice(0, 5).map((n) => (
              <div
                key={n._id}
                className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
                onClick={() => handleClick(n)}
              >
                <p className="text-sm text-gray-800">{n.message}</p>
                {n.dashboard && (
                  <ExternalLink
                    className="h-4 w-4 text-primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClick(n);
                    }}
                  />
                )}
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 w-full text-gray-600"
              onClick={() => setIsOpen(false)}
            >
              Close
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
