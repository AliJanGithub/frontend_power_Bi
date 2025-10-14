import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { DashboardViewer } from './DashboardViewer';
import { UserLayout } from '../user/UserLayout';
import { AdminLayout } from '../admin/AdminLayout';



export function DashboardViewerLayout({ dashboardId }) {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('dashboard-view');

  const handleTabChange = (tab) => {
    if (tab === 'dashboard-view') {
      // Stay on current dashboard view
      setCurrentTab(tab);
    } else {
      // Navigate to other sections
      if (user?.role === 'admin') {
        (window ).navigate('admin', { tab });
      } else {
        (window).navigate('user', { tab });
      }
    }
  };

  // Get stored navigation state (defaults to false/expanded if no stored state)
  const getStoredNavState = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('portal365-nav-collapsed');
      return stored !== null ? JSON.parse(stored) : false;
    }
    return false;
  };

  if (user?.role === 'admin') {
    return (
      <AdminLayout 
        currentTab={currentTab} 
        setCurrentTab={handleTabChange}
        initialCollapsed={getStoredNavState()}
      >
        <DashboardViewer dashboardId={dashboardId} />
      </AdminLayout>
    );
  }

  return (
    <UserLayout 
      currentTab={currentTab} 
      setCurrentTab={handleTabChange}
      initialCollapsed={getStoredNavState()}
    >
      <DashboardViewer dashboardId={dashboardId} />
    </UserLayout>
  );
}