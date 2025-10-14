import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { ReportViewer } from './ReportViewer';
import { UserLayout } from '../user/UserLayout';
import { AdminLayout } from '../admin/AdminLayout';



export function ReportViewerLayout({ reportId }) {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState('report-view');

  const handleTabChange = (tab) => {
    if (tab === 'report-view') {
      // Stay on current report view
      setCurrentTab(tab);
    } else {
      // Navigate to other sections
      if (user?.role === 'admin') {
        (window ).navigate('admin', { tab });
      } else {
        (window ).navigate('user', { tab });
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
        <ReportViewer reportId={reportId} />
      </AdminLayout>
    );
  }

  return (
    <UserLayout 
      currentTab={currentTab} 
      setCurrentTab={handleTabChange}
      initialCollapsed={getStoredNavState()}
    >
      <ReportViewer reportId={reportId} />
    </UserLayout>
  );
}