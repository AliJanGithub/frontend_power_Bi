import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api'; // your axios instance with interceptors

const DashboardContext = createContext(undefined);

export const DashboardProvider = ({ children }) => {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dashboardById,setDashboardId]=useState(null)

  // ✅ Get all dashboards (visible to user)
  const fetchDashboards = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/dashboards');
      setDashboards(response.data?.data?.dashboards || []);
      console.log(response);
      return response.data?.data?.dashboards || [];
    } catch (err) {
      console.error('Fetch dashboards failed:', err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Create new dashboard (Admin/SuperAdmin)
  // const createDashboard = async (payload) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const response = await api.post('/dashboards', payload);
  //     // Add new dashboard to list
  //     setDashboards((prev) => [response.data.data.dashboards, ...prev]);
  //     return response.data;
  //   } catch (err) {
  //     console.error('Create dashboard failed:', err);
  //     setError(err.response?.data?.dashboards?.message || err.message);
  //     throw err;
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const createDashboard = async (payload) => {
  setLoading(true);
  setError(null);
  try {
    // Payload must include: title, embedUrl, department, etc.
    const response = await api.post('/dashboards', payload);

    // Add the new dashboard to the local state
    setDashboards((prev) => [response.data.data.dashboard, ...prev]);

    return response.data;
  } catch (err) {
    console.error('Create dashboard failed:', err);
    setError(err.response?.data?.message || err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};


  // ✅ Get single dashboard by ID
  const getDashboardById = async (id) => {
    console.log("idddd",id)
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/dashboards/${id}`);
      console.log("dashboardbyid main context func",response?.data?.data)
      setDashboardId(response?.data?.data)
      console.log("dashboardbyid main context func",response?.data?.data?.dashboards,response)
      return response.data?.data;
    } catch (err) {
      console.error('Get dashboard failed:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update dashboard (Admin/SuperAdmin)
  const updateDashboard = async (id, payload) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/dashboards/${id}`, payload);
      const updatedDashboard = response.data?.data;

      setDashboards((prev) =>
        prev.map((d) =>
          d._id === id ? { ...d, ...updatedDashboard } : d
        )
      );

      return updatedDashboard;
    } catch (err) {
      console.error('Update dashboard failed:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete dashboard (Admin/SuperAdmin)
  const deleteDashboard = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/dashboards/${id}`);
      setDashboards((prev) => prev.filter((d) => d._id !== id));
      return true;
    } catch (err) {
      console.error('Delete dashboard failed:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

// ✅ Assign dashboard to users (Admin/SuperAdmin)
// const assignDashboard = async (id, userIds) => {
//   setLoading(true);
//   setError(null);
//   try {
//     // 🟢 Send array as required by backend
//     const response = await api.post(`/dashboards/${id}/assign`, {
//       userIds, // must be an array
//     });

//     console.log('Dashboard assigned:', response.data);

//     // 🟢 Update local state
//     setDashboards((prev) =>
//       prev.map((d) =>
//         d._id === id
//           ? { ...d, accessUsers: [...(d.accessUsers || []), ...userIds] }
//           : d
//       )
//     );

//     return response.data;
//   } catch (err) {
//     console.error('Assign dashboard failed:', err);
//     setError(err.response?.data?.message || err.message);
//     throw err;
//   } finally {
//     setLoading(false);
//   }
// };
const assignDashboard = async (userIds, department) => {
  console.log("printinggggggggggg",department,userIds)
  setLoading(true);
  setError(null);
  try {
    const response = await api.post('/dashboards/assign-by-department', {
      department,
      userIds
    });

    const updatedIds = response.data.data.dashboards.map(d => d._id);

    // Update local dashboards with new accessUsers
    setDashboards((prev) =>
      prev.map((d) =>
        updatedIds.includes(d._id)
          ? {
              ...d,
              accessUsers: Array.from(new Set([...(d.accessUsers || []), ...userIds]))
            }
          : d
      )
    );

    return response.data;
  } catch (err) {
    console.error('Assign by department failed:', err);
    setError(err.response?.data?.message || err.message);
    throw err;
  } finally {
    setLoading(false);
  }
};



  // ✅ Unassign dashboard from user
  const unassignDashboard = async (dashboardId, userId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/dashboards/${dashboardId}/unassign`, {
        userId,
      });

      setDashboards((prev) =>
        prev.map((d) =>
          d._id === dashboardId
            ? { ...d, accessUsers: (d.accessUsers || []).filter((id) => id !== userId) }
            : d
        )
      );

      return response.data;
    } catch (err) {
      console.error('Unassign dashboard failed:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch dashboards automatically on mount
  useEffect(() => {
    fetchDashboards();
    
  }, []);

  return (
    <DashboardContext.Provider
      value={{
        dashboards,
        loading,
        error,
        dashboardById,
        fetchDashboards,
        createDashboard,
        getDashboardById,
        updateDashboard,
        deleteDashboard,
        assignDashboard, // ✅ added here
        unassignDashboard,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

// ✅ Custom hook for easy access
export const useDashboards = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboards must be used within a DashboardProvider');
  }
  return context;
};
