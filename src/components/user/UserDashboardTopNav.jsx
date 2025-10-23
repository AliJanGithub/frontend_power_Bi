import React, { useState } from 'react';
import { UserLayoutTopNav } from './UserLayoutTopNav';
import { FavoritesDashboard } from './FavoritesDashboard';
import { DashboardBrowser } from './DashboardBrowser';
import { ReportBrowser } from './ReportBrowser';
import { UserProfile } from './UserProfile';



export function UserDashboardTopNav({ initialTab = 'favorites' }) {
  const [currentTab, setCurrentTab] = useState(initialTab);

  const renderTabContent = () => {
    switch (currentTab) {
      case 'favorites':
        return <FavoritesDashboard />;
      case 'browse':
        return <DashboardBrowser />;
      case 'reports':
        return <ReportBrowser />;
      case 'settings':
        return <UserProfile />;
      default:
        return <FavoritesDashboard />;
    }
  };

  return (
    <UserLayoutTopNav currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {renderTabContent()}
    </UserLayoutTopNav>
  );
}




// import React, { useState } from 'react';
// import { useAuth } from '../AuthContext';
// import { useData } from '../DataContext';
// import { Button } from '../ui/button';
// import { Badge } from '../ui/badge';
// import { Logo } from '../Logo';
// import { NotificationButton } from '../NotificationButton';
// import { UserDropdown } from '../UserDropdown';
// import { 
//   Monitor, 
//   Heart, 
//   User, 
//   Home,
//   Settings,
//   FileText
// } from '../icons/Icons';



// export function UserLayoutTopNav({ children, currentTab, setCurrentTab }) {
//   const { user } = useAuth();
//   const { favorites, getUserAccessibleDashboards } = useData();

//   const accessibleDashboards = getUserAccessibleDashboards();

//   const menuItems = [
//     { 
//       id: 'favorites', 
//       icon: Home, 
//       label: 'Home'
//     },
//     { 
//       id: 'browse', 
//       icon: Monitor, 
//       label: 'Dashboards'
//     },
//     { 
//       id: 'reports', 
//       icon: FileText, 
//       label: 'Reports'
//     },
//     { 
//       id: 'settings', 
//       icon: Settings, 
//       label: 'Settings'
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
//       {/* Top Navigation Bar */}
//       <header className="bg-white/95 backdrop-blur-sm border-b border-primary/10 shadow-sm">
//         <div className="px-6 py-4">
//           <div className="flex items-center justify-between">
//             {/* Left: Logo and Navigation */}
//             <div className="flex items-center space-x-8">
//               <Logo size="md" />
              
//               {/* Navigation Menu */}
//               <nav className="flex items-center space-x-2">
//                 {menuItems.map((item) => {
//                   const Icon = item.icon;
//                   return (
//                     <button
//                       key={item.id}
//                       onClick={() => setCurrentTab(item.id)}
//                       className={`flex items-center px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
//                         currentTab === item.id
//                           ? 'bg-gradient-to-r from-success to-success/90 text-white shadow-lg shadow-success/25'
//                           : 'text-gray-700 hover:bg-success/5 hover:text-success hover:shadow-sm'
//                       }`}
//                     >
//                       <Icon className="h-4 w-4 mr-2" />
//                       {item.label}
//                     </button>
//                   );
//                 })}
//               </nav>
//             </div>
            
//             {/* Right: User Actions */}
//             <div className="flex items-center space-x-2">
//               <NotificationButton />
//               <UserDropdown />
//             </div>
//           </div>
//         </div>
//       </header>

//       {/* Main Content - Full Width */}
//       <main className="p-6">
//         {children}
//       </main>

//       {/* Optional: Quick Stats Bar */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-primary/10 shadow-lg">
//         <div className="px-6 py-3">
//           <div className="flex items-center justify-center space-x-8 text-sm">
//             <div className="flex items-center space-x-2">
//               <span className="text-gray-600">Available Dashboards:</span>
//               <Badge variant="secondary" className="text-xs">
//                 {accessibleDashboards.length}
//               </Badge>
//             </div>
//             <div className="flex items-center space-x-2">
//               <span className="text-gray-600">Your Favorites:</span>
//               <Badge variant="secondary" className="text-xs">
//                 {favorites.length}
//               </Badge>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }