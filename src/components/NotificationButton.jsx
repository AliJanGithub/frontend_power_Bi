// import React, { useState, useRef, useEffect } from 'react';
// import { createPortal } from 'react-dom';
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

// export function NotificationButton() {
//   const { user } = useAuth();
//   const { 
//     // getUserNotifications, 
//     markNotificationAsRead, 
//     markAllNotificationsAsRead,
//     // getUnreadCount 
//   } = useData();
  
//   const [isOpen, setIsOpen] = useState(false);
//   const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
//   const buttonRef = useRef(null);
//   // const notifications = getUserNotifications();

//   // const unreadCount = getUnreadCount();
//   const unreadCount=7

//   // Calculate dropdown position
//   const updatePosition = () => {
//     if (buttonRef.current) {
//       const rect = buttonRef.current.getBoundingClientRect();
//       const newPosition = {
//         top: rect.bottom + 8,
//         right: window.innerWidth - rect.right
//       };
//       setDropdownPosition(newPosition);
//     }
//   };

//   useEffect(() => {
//     if (isOpen) {
//       updatePosition();
//     }
//   }, [isOpen]);

//   // Handle click outside to close dropdown
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (buttonRef.current && !buttonRef.current.contains(event.target )) {
//         const dropdown = document.getElementById('notification-dropdown');
//         if (dropdown && !dropdown.contains(event.target )) {
//           setIsOpen(false);
//         }
//       }
//     };

//     if (isOpen) {
//       document.addEventListener('mousedown', handleClickOutside);
//       return () => document.removeEventListener('mousedown', handleClickOutside);
//     }
//   }, [isOpen]);

//   if (!user) {
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

//   // Dropdown component
//   const DropdownContent = () => (
//     <div id='legacy-design-wrapper'>

    
//     <div 
//       id="notification-dropdown"
//       className="fixed w-80"
//       style={{
//         top: `${dropdownPosition.top}px`,
//         right: `${dropdownPosition.right}px`,
//         zIndex: 9999
//       }}
//     >
//       <Card id={"legacy-design-wrapper"} className="shadow-xl border-0 bg-white/95 backdrop-blur-sm animate-in fade-in-80 slide-in-from-top-2">
//         <CardContent className="p-0">
//           {/* Header */}
//           <div className="px-3 py-2 border-b border-gray-100">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-2">
//                 <Bell className="h-4 w-4 text-primary" />
//                 <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
//                 {unreadCount > 0 && (
//                   <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">
//                     {unreadCount}
//                   </Badge>
//                 )}
//               </div>
//               <div className="flex items-center space-x-1">
//                 {unreadCount > 0 && (
//                   <Button
//                     variant="ghost"
//                     size="sm"
//                     onClick={markAllNotificationsAsRead}
//                     className="text-xs h-6 px-1.5"
//                   >
//                     <CheckCheck className="h-3 w-3" />
//                   </Button>
//                 )}
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => setIsOpen(false)}
//                   className="h-6 w-6 p-0"
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           {/* Notifications List */}
//           <div className="max-h-64 overflow-y-auto">
//             {notifications.length === 0 ? (
//               <div className="p-4 text-center text-gray-500">
//                 <Bell className="h-6 w-6 mx-auto mb-2 text-gray-400" />
//                 <p className="text-xs">No notifications yet</p>
//               </div>
//             ) : (
//               <div className="divide-y divide-gray-100">
//                 { notifications && notifications.slice(0, 8).map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
//                       !notification.isRead ? 'bg-blue-50/50' : ''
//                     }`}
//                     onClick={() => handleNotificationClick(notification)}
//                   >
//                     <div className="flex items-start space-x-2">
//                       <div className="flex-shrink-0 mt-0.5">
//                         {getNotificationIcon(notification.type)}
//                       </div>
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-start justify-between">
//                           <div className="flex-1 min-w-0 pr-2">
//                             <p className={`text-sm leading-tight ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
//                               {notification.title}
//                             </p>
//                             <p className="text-xs text-gray-600 mt-1 leading-relaxed">
//                               {notification.message}
//                             </p>
//                           </div>
//                           <div className="flex-shrink-0 flex flex-col items-end space-y-1">
//                             {!notification.isRead && (
//                               <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
//                             )}
//                             <span className="text-xs text-gray-500 whitespace-nowrap">
//                               {formatTimeAgo(notification.createdAt)}
//                             </span>
//                           </div>
//                         </div>
//                         {notification.dashboardId && (
//                           <div className="mt-2 flex justify-end">
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
//                               View Dashboard
//                             </Button>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {notifications.length > 8 && (
//             <div className="px-3 py-2 border-t border-gray-100 text-center">
//               <Button variant="ghost" size="sm" className="text-xs text-gray-600 h-6">
//                 View all ({notifications.length})
//               </Button>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//     </div>
//   );

//   return (
//     <>
//       {/* Bell Icon Button */}
//       <Button
//         ref={buttonRef}
//         id={"legacy-design-wrapper"}
//         variant="ghost"
//         size="sm"
//         className="relative p-2 h-auto hover:bg-primary/5 transition-colors"
//         onClick={() => {
//           if (!isOpen) {
//             updatePosition();
//           }
//           setIsOpen(!isOpen);
//         }}
//       >
//         <Bell className="h-5 w-5 text-gray-600" />
        
//         {/* Notification Count Badge */}
//         {unreadCount > 0 && (
//           <Badge 
//             variant="destructive" 
//             className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
//           >
//             {unreadCount > 9 ? '9+' : unreadCount}
//           </Badge>
//         )}
//       </Button>

//       {/* Portal-rendered Dropdown Menu */}
//       {isOpen && createPortal(<DropdownContent />, document.body)}
//     </>
//   );
// }
// NotificationButton.jsx
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Bell, MessageSquare, UserPlus, Dashboard, ExternalLink, X, CheckCheck } from './icons/Icons';

export function NotificationButton() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);

 // NotificationButton.jsx (Conceptual changes needed for full solution)
    const accessToken = localStorage.getItem('accessToken'); 

  useEffect(() => {
    if (!user) return;

    // 1. Initial Data Fetch (REQUIRED)
    // You need an API call here to fetch all existing notifications for the user
    // e.g., fetch('/api/notifications')
    // and set them into the state: setNotifications(fetchedNotifications);


    // 2. Socket Connection
    const socket = io('http://localhost:5000/notifications', {
      auth: { token: accessToken },
    });

    // 3. Socket Listener
    socket.on('new_notification', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
    });

    return () => socket.disconnect();
  }, [user, accessToken]); // <- assuming accessToken is available here

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  console.log("notifications nnnnnnnnnn",notifications)
  const handleNotificationClick = (notification,closeDropdown=true) => {
    
    setNotifications((prev) =>
      prev.map((n) => (n._id === notification._id ? { ...n, isRead: true } : n))
    );
        console.log("Navigating to:", `/view-dashboard/${notification}`);
    console.log("notifications  ssssssssssssssssssssssssss",notification)


    if (notification) {
      console.log("Navigating to:", `/view-dashboard/${notification.dashboard}`);

      navigate(`/view-dashboard/${notification.dashboard}`);
    }
 if (closeDropdown) {
    setTimeout(() => setIsOpen(false), 200);
  }  };

  const markAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'COMMENT':
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'NEW_DASHBOARD':
        return <Dashboard className="h-4 w-4 text-purple-600" />;
      case 'ACCESS_GRANTED':
        return <UserPlus className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
    }
  };

  useEffect(() => {
    if (isOpen) updatePosition();
  }, [isOpen]);

  // Click outside closes dropdown
  useEffect(() => {
    const close = (e) => {
      if (buttonRef.current && !buttonRef.current.contains(e.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, [isOpen]);

  const DropdownContent = () => (
    <div
      id="notification-dropdown"
      className="fixed w-80"
      style={{ top: `${dropdownPosition.top}px`, right: `${dropdownPosition.right}px`, zIndex: 9999 }}
    >
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="px-1.5 py-0.5 text-xs">{unreadCount}</Badge>
              )}
            </div>
            <div className="flex items-center space-x-1">
              {unreadCount > 0 && (
                <Button variant="ghost" size="sm" onClick={markAllAsRead} className="h-6 px-2">
                  <CheckCheck className="h-3 w-3" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)} className="h-6 w-6 p-0">
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-gray-100">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                <Bell className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                <p className="text-xs">No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-3 hover:bg-gray-50 cursor-pointer ${
                    !notification.isRead ? 'bg-blue-50/50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{notification.message}</p>
                      <p className="text-xs text-gray-500">{new Date(notification.createdAt).toLocaleString()}</p>
                      {notification.dashboard && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 px-2 text-xs text-primary"
                          onClick={(e) => {
                          e.stopPropagation();
    handleNotificationClick(notification, false); // don't close immediately
    setTimeout(() => setIsOpen(false), 200); // close after navigate
                          }}
                        >
                          {/* <ExternalLink className="h-3 w-3 mr-1" /> View Dashboard */}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  if (!user) return null;

  return (
    <>
      <Button
        ref={buttonRef}
        variant="ghost"
        size="sm"
        className="relative p-2 h-auto"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-5 w-5 text-gray-600" />
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

{isOpen && <DropdownContent />}
    </>
  );
}
