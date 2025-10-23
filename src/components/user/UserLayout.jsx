import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useData } from '../DataContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Logo } from '../Logo';
import { NotificationButton } from '../NotificationButton';
import { UserDropdown } from '../UserDropdown';
import { 
  Monitor, 
  Heart, 
  User, 
  Home,
  Settings,
  ChevronLeft,
  ChevronRight,
  FileText
} from '../icons/Icons';
import { useDashboards } from '../DashboardContext';


export function UserLayout({ children, currentTab, setCurrentTab, initialCollapsed = false }) {
  // const { user } = useAuth();
  const { favorites } = useData();
  const {dashboards}=useDashboards()
  // Initialize from localStorage or use initialCollapsed
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('portal365-nav-collapsed');
      return stored !== null ? JSON.parse(stored) : initialCollapsed;
    }
    return initialCollapsed;
  });

  const accessibleDashboards = [
  {
    id: '1',
    userId: '2',
    userName: 'John Doe',
    dashboardId: '1',
    dashboardTitle: 'Sales Performance Dashboard',
    action: 'view',
    timestamp: '2024-01-25T10:30:00Z'
  },
  {
    id: '2',
    userId: '3',
    userName: 'Jane Smith',
    dashboardId: '2',
    dashboardTitle: 'Marketing Analytics',
    action: 'view',
    timestamp: '2024-01-25T11:45:00Z'
  },
  {
    id: '3',
    userId: '2',
    userName: 'John Doe',
    dashboardId: '3',
    dashboardTitle: 'Finance Dashboard',
    action: 'view',
    timestamp: '2024-01-25T14:20:00Z'
  },
  {
    id: '4',
    userId: '3',
    userName: 'Jane Smith',
    dashboardId: '3',
    dashboardTitle: 'Finance Dashboard',
    action: 'favorite',
    timestamp: '2024-01-25T15:30:00Z'
  }
];

  // Handle collapse state change and persist to localStorage
  const handleCollapseToggle = () => {
    const newCollapsedState = !isCollapsed;
    setIsCollapsed(newCollapsedState);
    localStorage.setItem('portal365-nav-collapsed', JSON.stringify(newCollapsedState));
  };

  const menuItems = [
    { 
      id: 'favorites', 
      icon: Home, 
      label: 'Home'
    },
    { 
      id: 'browse', 
      icon: Monitor, 
      label: 'Dashboards'
    },
    // { 
    //   id: 'reports', 
    //   icon: FileText, 
    //   label: 'Reports'
    // },
    { 
      id: 'settings', 
      icon: Settings, 
      label: 'Settings'
    }
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-primary/10 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Logo size="md" />
            </div>
            
            <div className="flex items-center space-x-2">
              <NotificationButton />
              <UserDropdown />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <nav className={`${isCollapsed ? 'w-12' : 'w-44'} bg-white/80 backdrop-blur-sm border-r border-primary/10 min-h-[calc(100vh-73px)] shadow-sm transition-all duration-300`}>
          {/* Collapse Button */}
          <div className="p-3 border-b border-gray-200">
            {isCollapsed ? (
              <button
                onClick={handleCollapseToggle}
                className="w-full flex items-center justify-center px-1 py-2 text-sm rounded-lg transition-all duration-200 text-gray-700 hover:bg-success/5 hover:text-success hover:shadow-sm"
                title="Expand Menu"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={handleCollapseToggle}
                className="w-full flex items-center px-3 py-3 hover:bg-success/10 hover:border-success/30 transition-all duration-200"
              >
                <div className="flex items-center">
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  <span className="text-sm font-medium">Collapse Menu</span>
                </div>
              </Button>
            )}
          </div>

          <div className="p-3 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-1' : 'px-3'} py-2 text-sm rounded-lg transition-all duration-200 ${
                    currentTab === item.id
                      ? 'bg-gradient-to-r from-success to-success/90 text-white shadow-lg shadow-success/25'
                      : 'text-gray-700 hover:bg-success/5 hover:text-success hover:shadow-sm'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center">
                    <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
                    {!isCollapsed && item.label}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Quick Stats */}
          {!isCollapsed && (
            <div className="p-3 border-t border-gray-200 mt-2">
              <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">Quick Stats</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Available Dashboards</span>
                  <span className="font-medium">{dashboards.length}</span>
                </div>
                <div className="flex justify-between">
                  {/* <span className="text-gray-600">Your Favorites</span> */}
                  {/* <span className="font-medium">{favorites.length}</span> */}
                </div>
              </div>
            </div>
          )}
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { useData } from '../DataContext';
// import { Button } from '../ui/button';
// import { Logo } from '../Logo';
// import { NotificationButton } from '../NotificationButton';
// import { UserDropdown } from '../UserDropdown';
// import {
//   Monitor,
//   Home,
//   Settings,
//   ChevronLeft,
//   ChevronRight
// } from '../icons/Icons';
// import { useDashboards } from '../DashboardContext';

// export function UserLayout({ children, initialCollapsed = false }) {
//   const { dashboards } = useDashboards();
//   const { favorites } = useData();
//   const [isCollapsed, setIsCollapsed] = useState(() => {
//     if (typeof window !== 'undefined') {
//       const stored = localStorage.getItem('portal365-nav-collapsed');
//       return stored !== null ? JSON.parse(stored) : initialCollapsed;
//     }
//     return initialCollapsed;
//   });

//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleCollapseToggle = () => {
//     const newCollapsedState = !isCollapsed;
//     setIsCollapsed(newCollapsedState);
//     localStorage.setItem('portal365-nav-collapsed', JSON.stringify(newCollapsedState));
//   };

//   // Sidebar menu items with paths
//   const menuItems = [
//     { id: 'favorites', icon: Home, label: 'Home', path: '/user/favorites' },
//     { id: 'browse', icon: Monitor, label: 'Dashboards', path: '/user/browse' },
//     { id: 'settings', icon: Settings, label: 'Settings', path: '/user/settings' }
//   ];

//   // Determine active tab based on current URL
//   const activeTab = menuItems.find(item =>
//     location.pathname.startsWith(item.path)
//   )?.id;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
//       {/* Header */}
//       <header className="bg-white/95 backdrop-blur-sm border-b border-primary/10 shadow-sm">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <Logo size="md" />
//             </div>

//             <div className="flex items-center space-x-2">
//               <NotificationButton />
//               <UserDropdown />
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="flex">
//         {/* Sidebar */}
//         <nav
//           className={`${
//             isCollapsed ? 'w-12' : 'w-44'
//           } bg-white/80 backdrop-blur-sm border-r border-primary/10 min-h-[calc(100vh-73px)] shadow-sm transition-all duration-300`}
//         >
//           {/* Collapse Button */}
//           <div className="p-3 border-b border-gray-200">
//             {isCollapsed ? (
//               <button
//                 onClick={handleCollapseToggle}
//                 className="w-full flex items-center justify-center px-1 py-2 text-sm rounded-lg transition-all duration-200 text-gray-700 hover:bg-success/5 hover:text-success hover:shadow-sm"
//                 title="Expand Menu"
//               >
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             ) : (
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleCollapseToggle}
//                 className="w-full flex items-center px-3 py-3 hover:bg-success/10 hover:border-success/30 transition-all duration-200"
//               >
//                 <div className="flex items-center">
//                   <ChevronLeft className="h-4 w-4 mr-2" />
//                   <span className="text-sm font-medium">Collapse Menu</span>
//                 </div>
//               </Button>
//             )}
//           </div>

//           {/* Navigation Items */}
//           <div className="p-3 space-y-1">
//             {menuItems.map((item) => {
//               const Icon = item.icon;
//               const isActive = activeTab === item.id;

//               return (
//                 <button
//                   key={item.id}
//                   onClick={() => navigate(item.path)}
//                   className={`w-full flex items-center ${
//                     isCollapsed ? 'justify-center px-1' : 'px-3'
//                   } py-2 text-sm rounded-lg transition-all duration-200 ${
//                     isActive
//                       ? 'bg-gradient-to-r from-success to-success/90 text-white shadow-lg shadow-success/25'
//                       : 'text-gray-700 hover:bg-success/5 hover:text-success hover:shadow-sm'
//                   }`}
//                   title={isCollapsed ? item.label : undefined}
//                 >
//                   <div className="flex items-center">
//                     <Icon className={`h-4 w-4 ${isCollapsed ? '' : 'mr-2'}`} />
//                     {!isCollapsed && item.label}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* Quick Stats */}
//           {!isCollapsed && (
//             <div className="p-3 border-t border-gray-200 mt-2">
//               <h3 className="text-xs text-gray-500 uppercase tracking-wide mb-2">
//                 Quick Stats
//               </h3>
//               <div className="space-y-2 text-xs">
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Available Dashboards</span>
//                   <span className="font-medium">{dashboards.length}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span className="text-gray-600">Favorites</span>
//                   <span className="font-medium">{favorites.length}</span>
//                 </div>
//               </div>
//             </div>
//           )}
//         </nav>

//         {/* Main Content */}
//         <main className="flex-1 p-6">{children}</main>
//       </div>
//     </div>
//   );
// }
