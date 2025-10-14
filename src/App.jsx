import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthContext';
import { DataProvider } from './components/DataContext';
import { SettingsProvider } from './components/SettingsContext';
import { LoginPage } from './components/auth/LoginPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminDashboardTopNav } from './components/admin/AdminDashboardTopNav';
import { UserDashboard } from './components/user/UserDashboard';
import { UserDashboardTopNav } from './components/user/UserDashboardTopNav';
import { DashboardViewerLayout } from './components/dashboard/DashboardViewerLayout';
import { ReportViewerLayout } from './components/report/ReportViewerLayout';
import { ReportErrorBoundary } from './components/report/ReportErrorBoundary';
import { ToastProvider } from './components/ToastProvider';

function AppContent() {
  const { user, isAuthenticated } = useAuth();
  const [currentView, setCurrentView] = useState('login');
  const [viewParams, setViewParams] = useState({});

  // Navigation handler
  const navigate = (view, params = {}) => {
    setCurrentView(view);
    setViewParams(params);
  };

  // Make navigate globally accessible
  useEffect(() => {
    window.navigate = navigate;
  }, []);

  const renderCurrentView = () => {
    // If not logged in, only show login or forgot password
    if (!isAuthenticated) {
      switch (currentView) {
        case 'forgot-password':
          return <ForgotPasswordPage />;
        default:
          return <LoginPage />;
      }
    }

    // Authenticated views
    switch (currentView) {
      case 'view-dashboard':
        return <DashboardViewerLayout dashboardId={viewParams.id} />;
      case 'view-report':
        return (
          <ReportErrorBoundary>
            <ReportViewerLayout reportId={viewParams.id} />
          </ReportErrorBoundary>
        );
      case 'user-settings':
        return <UserDashboard initialTab="settings" />;
      case 'admin':
        return <AdminDashboard initialTab={viewParams.tab} />;
      case 'user':
        return <UserDashboard initialTab={viewParams.tab} />;
      case 'admin-topnav':
        return <AdminDashboardTopNav initialTab={viewParams.tab} />;
      case 'user-topnav':
        return <UserDashboardTopNav initialTab={viewParams.tab} />;
      default:
        return user?.role === 'admin' ? <AdminDashboard /> : <UserDashboard />;
    }
  };

  return <div className="min-h-screen bg-gray-50">{renderCurrentView()}</div>;
}

export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
        <DataProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </DataProvider>
      </AuthProvider>
    </SettingsProvider>
  );
}
