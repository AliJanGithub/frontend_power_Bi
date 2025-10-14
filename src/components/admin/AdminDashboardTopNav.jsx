import React, { useState } from 'react';
import { AdminLayoutTopNav } from './AdminLayoutTopNav';
import { AdminOverview } from './AdminOverview';
import { DashboardManagement } from './DashboardManagement';
import { ReportManagement } from './ReportManagement';
import { UserManagement } from './UserManagement';
import { OrganizationSettings } from './OrganizationSettings';



export function AdminDashboardTopNav({ initialTab = 'overview' }) {
  const [currentTab, setCurrentTab] = useState(initialTab);

  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview':
        return <AdminOverview />;
      case 'dashboards':
        return <DashboardManagement />;
      case 'reports':
        return <ReportManagement />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <OrganizationSettings />;
      default:
        return <AdminOverview />;
    }
  };

  return (
    <AdminLayoutTopNav currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {renderTabContent()}
    </AdminLayoutTopNav>
  );
}