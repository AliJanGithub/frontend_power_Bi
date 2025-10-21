import { useState } from 'react';
import api from '../../lib/api'; // your interceptor instance

export function useUserManagement() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [users, setUsers] = useState([]);

  // ✅ Invite user (Super Admin)
  const inviteUser = async (email, name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/admin/invite-user', { email, name });
      console.log(response)
      return response.data;
    } catch (err) {
      console.error('Invite user failed:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Add user (Admin or HR)
  const addUser = async (email, name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/users/add', { email, name });
      return response.data;
    } catch (err) {
      console.error('Add user failed:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Get all users
 const getUsers = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await api.get('/users');
    const allUsers = response.data?.data?.users || [];

    // ✅ Filter only those with role === 'USER'
    const filteredUsers = allUsers.filter(user => user.role === 'USER');

    setUsers(filteredUsers);
    console.log("Filtered users:", filteredUsers);
    return filteredUsers;
  } catch (err) {
    console.error('Get users failed:', err);
    setError(err.response?.data?.message || err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};



   const deleteUser = async (userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/users/${userId}`);
      console.log('User deleted:', response.data);

      // 🧹 Update local state after deletion
      setUsers(prev => prev.filter(u => u._id !== userId));

      return response.data;
    } catch (err) {
      console.error('Delete user failed:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  return {
    inviteUser,
    addUser,
    getUsers,
    users,
    loading,
    error,
    deleteUser,
   
  };
}
