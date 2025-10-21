import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { DashboardViewer } from './DashboardViewer';
import { UserLayout } from '../user/UserLayout';
import { AdminLayout } from '../admin/AdminLayout';
import { useNavigate, useParams } from 'react-router-dom';  // ✅ import useParams

export function DashboardViewerLayout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: dashboardId } = useParams(); // ✅ get :id from URL
  const [currentTab, setCurrentTab] = useState('dashboard-view');

  const handleTabChange = (tab) => {
    if (tab === 'dashboard-view') {
      setCurrentTab(tab);
    } else {
      if (user?.role === 'ADMIN') {
        navigate(`/admin?tab=${tab}`);
      } else {
        navigate(`/user?tab=${tab}`);
      }
    }
  };

  console.log("dashboardId from URL:", dashboardId);

  const getStoredNavState = () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('portal365-nav-collapsed');
      return stored !== null ? JSON.parse(stored) : false;
    }
    return false;
  };

  if (user?.role === 'ADMIN') {
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
