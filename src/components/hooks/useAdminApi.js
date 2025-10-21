import { useState, useEffect, useCallback } from 'react';
import api from '../../lib/api'; // Assuming this is your axios instance

// --- Interfaces (Moved from AdminDashboard) ---
// export interface Dashboard {
//   _id: string;
//   title: string;
//   description: string;
//   embedUrl: string;
//   tags: string[];
//   assignedUsers: string[];
//   createdAt: string;
// }

// export interface User {
//   _id: string;
//   name: string;
//   email: string;
//   role: string;
// }

// export interface DashboardForm {
//   title: string;
//   description: string;
//   embedUrl: string;
//   tags: string; // Stored as string in form, parsed before API hit
// }

// export interface InviteForm {
//   email: string;
//   name: string;
// }
// ----------------------------------------------

export const useAdminApi = () => {
  // Global State for data and status
  const [dashboards, setDashboards] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Function to clear success message after a delay
  const clearSuccess = () => {
    setTimeout(() => setSuccess(''), 3000);
  };

  /**
   * Fetches all dashboards and non-admin users.
   */
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [dashboardsRes, usersRes] = await Promise.all([
        api.get('/dashboards'),
        api.get('/users'),
      ]);
      setDashboards(dashboardsRes.data.data.dashboards);
      // Filter only 'user' role for assignment list
      console.log(usersRes.data.data.users)
      setUsers(usersRes.data.data.users);
    } catch (err) {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Effect to run initial data fetch
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  /**
   * Creates a new dashboard.
   */
  console.log(dashboards)
  const createDashboard = async (formData) => {
    setError('');
    try {
      await api.post('/dashboards', {
        ...formData,
        // Convert comma-separated string to array
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      });
      setSuccess('Dashboard created successfully!');
      refreshData();
      clearSuccess();
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to create dashboard';
      setError(errorMessage);
      return false;
    }
  };

  /**
   * Sends an invitation to a new user.
   */
  const inviteUser = async (formData) => {
    setError('');
    try {
      await api.post('/admin/invite-user', formData);
      setSuccess('Invitation sent successfully!');
      clearSuccess();
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send invitation';
      setError(errorMessage);
      return false;
    }
  };
const getAllUsers=async()=>{
  setError('')
    try {
      await api.get('/usersr');
      setSuccess('Invitation sent successfully!');
      clearSuccess();
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to send invitation';
      setError(errorMessage);
      return false;
    }
}
  /**
   * Assigns a dashboard to a list of user IDs.
   */
  const assignDashboard = async (dashboardId, userIds) => {
    setError('');
    try {
      await api.post(`/dashboards/${dashboardId}/assign`, { userIds });
      setSuccess('Dashboard assigned successfully!');
      refreshData();
      clearSuccess();
      return true;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to assign dashboard';
      setError(errorMessage);
      return false;
    }
  };

  /**
   * Deletes a dashboard by ID.
   */
  const deleteDashboard = async (id) => {
    setError('');
    if (!confirm('Are you sure you want to delete this dashboard? This action cannot be undone.')) {
        return false;
    }
    try {
      await api.delete(`/dashboards/${id}`);
      setSuccess('Dashboard deleted successfully!');
      refreshData();
      clearSuccess();
      return true;
    } catch (err) {
      setError('Failed to delete dashboard.');
      return false;
    }
  };

  // Expose state and functions for the component to use
  return {
    // Data
    dashboards,
    users,
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
    deleteDashboard,
  };
};
