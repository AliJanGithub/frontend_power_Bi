import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../lib/api';




const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userRoleUser,setUserRoleUser]=useState([])
  const [loadings, setLoading] = useState(true);
  const [error,setError]=useState(null)

  useEffect(() => {
    if(!localStorage.getItem('accessToken')) return
   getUsers()
   console.log("useeffect runs")
    setLoading(false);
  }, []);

 const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });

    // ✅ Log only the data part (safe)
    console.log("Login Response Data:", response.data);

    if (!response.data?.success) {
      throw new Error(response.data?.message || "Invalid login credentials");
    }

    const { accessToken, refreshToken, user: userData } = response.data.data || {};

    if (!accessToken || !userData) {
      throw new Error("Invalid login response — missing tokens or user data");
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return { success: true, user: userData };
  } catch (error) {
    // ✅ Avoid logging entire error objects with circular refs
    console.error("Login failed:", error.message || error);

    return { success: false, error: error.message || "Login failed" };
  }
};


const getUsers=async()=>{
   setLoading(true);
    setError(null);
    try {
      const response = await api.get('/users');
      const allUsers = response.data?.data?.users || [];
        console.log("all users inside auth context",allUsers)
      // ✅ Filter only those with role === 'USER'
      const filteredUsers = allUsers.filter(user => user.role =="USER");
  
      setUserRoleUser(filteredUsers);
      console.log("Filtered users:", filteredUsers);
      return filteredUsers;
    } catch (err) {
      console.error('Get users failed:', err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
}
  

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const acceptInvite = async (token, password, name) => {
    const response = await api.post('/auth/accept-invite', { token, password, name });
    const { accessToken, refreshToken, user: userData } = response.data;

    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ user, loadings, login, logout, acceptInvite,userRoleUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
