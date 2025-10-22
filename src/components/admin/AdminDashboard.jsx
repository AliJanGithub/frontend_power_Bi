import React, { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { DashboardManagement } from './DashboardManagement';
import { ReportManagement } from './ReportManagement';
import { UserManagement } from './UserManagement';
import { AdminOverview } from './AdminOverview';
import { OrganizationSettings } from './OrganizationSettings';

export function AdminDashboard() {
  const [currentTab, setCurrentTab] = useState('overview');

  const renderCurrentTab = () => {
    switch (currentTab) {
      case 'dashboards':
        return <DashboardManagement />;
      // case 'reports':
      //   return <ReportManagement />;
      case 'users':
        return <UserManagement />;
      case 'settings':
        return <OrganizationSettings />;
      default:
        return <AdminOverview setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <AdminLayout currentTab={currentTab} setCurrentTab={setCurrentTab}>
      {renderCurrentTab()}
    </AdminLayout>
  );
}