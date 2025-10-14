import React, { useState } from 'react';
import { UserLayout } from './UserLayout';
import { DashboardBrowser } from './DashboardBrowser';
import { ReportBrowser } from './ReportBrowser';
import { FavoritesDashboard } from './FavoritesDashboard';
import { UserProfile } from './UserProfile';


export function UserDashboard({ initialTab = 'favorites' }) {
  const [currentTab, setCurrentTab] = useState(initialTab);

  const renderCurrentTab = () => {
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
    <UserLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {renderCurrentTab()}
    </UserLayout>
  );
}