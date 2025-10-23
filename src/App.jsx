import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { DataProvider } from './components/DataContext';
import { SettingsProvider } from './components/SettingsContext';
import { ToastProvider } from './components/ToastProvider';

import { LoginPage } from './components/auth/LoginPage';
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminDashboardTopNav } from './components/admin/AdminDashboardTopNav';
import { UserDashboard } from './components/user/UserDashboard';
// import { UserDashboardTopNav } from './components/user/UserDashboardTopNav';
import { DashboardViewerLayout } from './components/dashboard/DashboardViewerLayout';
import { ReportViewerLayout } from './components/report/ReportViewerLayout';
import { ReportErrorBoundary } from './components/report/ReportErrorBoundary';
import { SuperAdminDashboard } from './components/superadmin/SuperAdminDashboard';
import { DashboardProvider } from './components/DashboardContext';
import { AcceptInvitePage } from './components/auth/AcceptInvitePage';
import { SocketProvider } from './components/SocketContext';

// ✅ Simple PrivateRoute wrapper
// ✅ Fixed PrivateRoute with loading support
function PrivateRoute({ children, roles }) {
  const { user, loading } = useAuth();

  // Wait for AuthProvider to finish restoring user
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Once loading is done, check authentication
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user?.role?.toUpperCase())) {
    return <Navigate to="/" replace />;
  }

  return children;
}


// ✅ Role-based router
function DashboardRouter() {
  const { user } = useAuth();
  if (!user) return null;

  switch (user.role?.toUpperCase()) {
    case 'SUPER_ADMIN':
      return <SuperAdminDashboard />;
    case 'ADMIN':
      return <AdminDashboard />;
    default:
      return <UserDashboard />;
  }
}

// ✅ Main App
export default function App() {
  return (
    <SettingsProvider>
      <AuthProvider>
   

      
        <DataProvider>
          <ToastProvider>

            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Private role-based root */}
              <Route
                path="/"
                element={
                  <PrivateRoute>
                         <DashboardProvider>
                    <DashboardRouter />
                    </DashboardProvider>
                  </PrivateRoute>
                }
              />

              {/* 🧩 Dashboard viewer */}
              <Route
                path="/view-dashboard/:id"
                element={
                  <PrivateRoute>
                  <SocketProvider>

                  
                    <DashboardProvider>
                    <DashboardViewerLayout />

                    </DashboardProvider>
                    </SocketProvider>
                  </PrivateRoute>
                }
              />

              {/* 🧩 Report viewer */}
              <Route
                path="/view-report/:id"
                element={
                  <PrivateRoute>
                    <ReportErrorBoundary>
                      <ReportViewerLayout />
                    </ReportErrorBoundary>
                  </PrivateRoute>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute roles={['ADMIN']}>
                    <DashboardProvider>
                    <AdminDashboard />

                    </DashboardProvider>
                  </PrivateRoute>
                }
              />
              <Route
                path="/admin-topnav"
                element={
                  <PrivateRoute roles={['ADMIN']}>
                    <AdminDashboardTopNav />
                  </PrivateRoute>
                }
              />

              {/* User routes */}
              <Route
                path="/user"
                element={
                  <PrivateRoute roles={['USER']}>
                    <DashboardProvider>
                    <UserDashboard />

                    </DashboardProvider>
                  </PrivateRoute>
                }
              />
              {/* <Route
                path="/user-topnav"
                element={
                  <PrivateRoute roles={['USER']}>
                    <UserDashboardTopNav />
                  </PrivateRoute>
                }
              /> */}

              {/* Super Admin route */}
              <Route
                path="/superadmin"
                element={
                  <PrivateRoute roles={['SUPER_ADMIN']}>
                    <SuperAdminDashboard />
                  </PrivateRoute>
                }
              />

              {/* Fallback */}
              <Route path="/accept-invite" element={<AcceptInvitePage />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ToastProvider>
        </DataProvider>
       
      </AuthProvider>
    </SettingsProvider>
  );
}
