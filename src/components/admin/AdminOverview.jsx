import React, { useState,useEffect } from 'react';
import { useData } from '../DataContext';
import { Card, CardHeader, CardContent, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { 
  Monitor, 
  Users, 
  Mail,
  Plus,
  UserPlus,
  Clock,
  CheckCircle,
  X,
  FileText,
  BarChart3
} from '../icons/Icons';

import { useAdminApi } from '../hooks/useAdminApi';

// Mock users by department - this would come from a user service in real app
const mockUsersByDepartment = {
  'Finance': 3,
  'Sales': 2,
  'Marketing': 1,
  'Human Resources': 1,
  'Operations': 1
};

const mockTotalUsers = Object.values(mockUsersByDepartment).reduce((sum, count) => sum + count, 0);

// Define consistent colors for departments
const departmentColors = [
  '#4472C4', // Blue
  '#5CB85C', // Green
  '#F39C12', // Orange
  '#E74C3C', // Red
  '#9B59B6', // Purple
  '#1ABC9C', // Teal
  '#34495E', // Dark blue-gray
  '#F1C40F'  // Yellow
];

export function AdminOverview({ setCurrentTab }) {
  const [pendingInvite,setPendingInvitations]=useState(0)
  const {  reports, invitations } = useData();


  const { // Data
   
    users,
    dashboards,
    // Status
    loading,
    error,
    success,
    // Status setters (allows component to clear or set local errors if needed)
    setError,
    setSuccess,
    // Actions
    refreshData,
    createDashboard,
    inviteUser,
    assignDashboard,
    deleteDashboard,}=useAdminApi()
  // Calculate metrics
  const totalDashboards = dashboards.length
  const totalReports = reports.filter(r => r.isActive).length;
  const totalUsers = mockTotalUsers;
  // const pendingInvitations = invitations.filter(inv => inv.status === 'pending').length;

  // Process department data for pie charts
  console.log("admin overview userssssssss,",users)
  const getDepartmentData = (items, type) => {
    if (type === 'users') {
      return Object.entries(mockUsersByDepartment).map(([dept, count], index) => ({
        name: dept,
        value: count,
        color: departmentColors[index % departmentColors.length]
      }));
    }

    const departmentCounts = {};
  
    return Object.entries(departmentCounts).map(([dept, count], index) => ({
      name: dept,
      value: count,
      color: departmentColors[index % departmentColors.length]
    }));
  };

  const dashboardsByDept = getDepartmentData(dashboards, 'dashboards');
  const reportsByDept = getDepartmentData(reports, 'reports');
  const usersByDept = getDepartmentData([], 'users');
const handlePendingInvitations = () => {
  const pendingCount = users?.filter(user => user?.isActive === false).length || 0;
  setPendingInvitations(pendingCount);
};

useEffect(() => {
  
  handlePendingInvitations()
 
}, [])

  return (
    <div id='legacy-design-wrapper' className="space-y-6">
      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 rounded-lg border border-gray-200">
        <h1 className="text-2xl text-gray-900 mb-2">Welcome to BI Portal 365</h1>
        <p className="text-gray-600">Your centralized business intelligence dashboard for managing Power BI dashboards, Excel reports, and user access across all departments.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Active Users</p>
                <p className="text-3xl font-semibold text-gray-900">{users.length}</p>
                <p className="text-xs text-gray-500 mt-1">Registered users</p>
              </div>
              <div className="bg-blue-100 p-4 rounded-full">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Pending Invitations</p>
                <p className="text-3xl font-semibold text-gray-900">{pendingInvite}</p>
                <p className="text-xs text-gray-500 mt-1">Awaiting response</p>
              </div>
              <div className="bg-orange-100 p-4 rounded-full">
                <Mail className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Dashboards</p>
                <p className="text-3xl font-semibold text-gray-900">{totalDashboards}</p>
                <p className="text-xs text-gray-500 mt-1">Active dashboards</p>
              </div>
              <div className="bg-green-100 p-4 rounded-full">
                <Monitor className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Reports</p>
                <p className="text-3xl font-semibold text-gray-900">{totalReports}</p>
                <p className="text-xs text-gray-500 mt-1">Active reports</p>
              </div>
              <div className="bg-purple-100 p-4 rounded-full">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              onClick={() => setCurrentTab?.('users')}
              className="h-auto p-6 flex items-center justify-start space-x-4 text-left"
              size="lg"
            >
              <div className="bg-white/20 p-3 rounded-full">
                <UserPlus className="h-6 w-6" />
              </div>
              <div>
                <p className="font-medium">Invite Users</p>
                <p className="text-sm opacity-90">Send invitations to new team members</p>
              </div>
            </Button>
            
      <Button
  variant="outline"
  onClick={() => setCurrentTab?.('dashboards')}
  className="h-auto p-6 flex items-center justify-start space-x-4 text-left hover:bg-primary/5 max-w-full"
  size="lg"
>
  <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
    <Monitor className="h-6 w-6 text-primary" />
  </div>

  <div className="flex flex-col flex-1 min-w-0">
    <p className="font-medium">Add New Dashboard</p>
    <p className="text-sm text-gray-600 break-words whitespace-normal leading-snug">
      Create and configure a new Power BI dashboard
    </p>
  </div>
</Button>


            {/* <Button 
              variant="outline"
              onClick={() => setCurrentTab?.('reports')}
              className="h-auto p-6 flex items-center justify-start space-x-4 text-left hover:bg-primary/5"
              size="lg"
            >
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-medium">Add New Report</p>
                <p className="text-sm text-gray-600">Upload and configure a new Excel report</p>
              </div>
            </Button> */}
          </div>
        </CardContent>
      </Card>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dashboards by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Dashboards by Department</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardsByDept}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {dashboardsByDept.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} dashboard${value !== 1 ? 's' : ''}`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Reports by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Reports by Department</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={reportsByDept}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {reportsByDept.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} report${value !== 1 ? 's' : ''}`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Users by Department */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Users by Department</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersByDept}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {usersByDept.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} user${value !== 1 ? 's' : ''}`, 'Count']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}