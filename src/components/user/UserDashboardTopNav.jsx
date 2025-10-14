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