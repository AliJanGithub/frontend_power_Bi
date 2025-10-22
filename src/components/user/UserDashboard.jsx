import React, { useEffect, useState } from 'react';
import { UserLayout } from './UserLayout';
import { DashboardBrowser } from './DashboardBrowser';
import { ReportBrowser } from './ReportBrowser';
import { FavoritesDashboard } from './FavoritesDashboard';
import { UserProfile } from './UserProfile';
import { useUserManagement } from '../hooks/useUserManagement';
import { useGetProfile } from '../hooks/useGetProfile';


export function UserDashboard({ initialTab = 'favorites' }) {
  const [currentTab, setCurrentTab] = useState(initialTab);
      
 const { getProfile, error, loading } = useGetProfile();

  useEffect(() => {
    // IIFE to handle async
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