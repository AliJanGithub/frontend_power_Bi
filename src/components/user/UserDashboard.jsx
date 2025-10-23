import React, { useEffect, useState } from 'react';
import { UserLayout } from './UserLayout';
import { DashboardBrowser } from './DashboardBrowser';
import { ReportBrowser } from './ReportBrowser';
import { FavoritesDashboard } from './FavoritesDashboard';
import { UserProfile } from './UserProfile';
import { useUserManagement } from '../hooks/useUserManagement';
import { useGetProfile } from '../hooks/useGetProfile';
import { useNavigate } from 'react-router-dom';


export function UserDashboard({ initialTab = 'favorites' }) {
  const [currentTab, setCurrentTab] = useState(initialTab);
      
 const { getProfile, error, loading } = useGetProfile();
     const navigate=useNavigate()
  useEffect(() => {

    (async () => {
      try {
        const profile = await getProfile();
        console.log("User profile fetched:", profile);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    })();
  }, []);

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'favorites':
        return <FavoritesDashboard />;
      case 'browse':
        return <DashboardBrowser />;
      // case 'reports':
      //   return <ReportBrowser />;
      case 'settings':
        return <UserProfile />;
      default:
        return <FavoritesDashboard />;
    }
  };

  return (
    <UserLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {renderCurrentTab()}
    </UserLayout>
  );
}

// import React, { useEffect } from 'react';
// import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
// import { UserLayout } from './UserLayout';
// import { DashboardBrowser } from './DashboardBrowser';
// import { FavoritesDashboard } from './FavoritesDashboard';
// import { UserProfile } from './UserProfile';
// import { useGetProfile } from '../hooks/useGetProfile';

// export function UserDashboard() {
//   const { getProfile } = useGetProfile();
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     (async () => {
//       try {
//         const profile = await getProfile();
//         console.log('User profile fetched:', profile);
//       } catch (err) {
//         console.error('Error fetching user profile:', err);
//       }
//     })();
//   }, []);

//   // if user lands on /user with no sub-route, redirect to /user/favorites
//   useEffect(() => {
//     if (location.pathname === '/user') {
//       navigate('/user/favorites', { replace: true });
//     }
//   }, [location.pathname, navigate]);

//   return (
//     <UserLayout>
//       <Routes>
//         <Route path="favorites" element={<FavoritesDashboard />} />
//         <Route path="browse" element={<DashboardBrowser />} />
//         <Route path="settings" element={<UserProfile />} />
//       </Routes>
//     </UserLayout>
//   );
// }
