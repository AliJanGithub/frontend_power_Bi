// src/contexts/SocketContext.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { config } from '../constants/constants';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [activeDashboardId, setActiveDashboardId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    // Use the same base URL as your backend
    // const apiUrl =
    //   config?.backend_api?.replace('/api', '') || 'http://localhost:5000';
      const envApiUrl = import.meta.env.VITE_API_URL; // e.g. https://powerbibackendnodejs-production.up.railway.app/api
    const apiUrl = envApiUrl?.replace('/api', '') || 'http://localhost:5000';

    // Initialize socket connection
    const newSocket = io(`${apiUrl}/comments`, {
      auth: { token },
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Connection success
    newSocket.on('connect', () => {
      console.log('✅ Connected to comments socket');
      setConnected(true);
    });

    // Connection lost
    newSocket.on('disconnect', () => {
      console.warn('⚠️ Disconnected from comments socket');
      setConnected(false);
    });

    // Authentication or connection error
    newSocket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
    });

    setSocket(newSocket);

    // Clean up socket on unmount
    return () => {
      newSocket.disconnect();
      setConnected(false);
      setSocket(null);
    };
  }, []);

  /**
   * Join a dashboard's comment room
   */
  const joinDashboard = useCallback(
    (dashboardId) => {
      if (socket && connected && dashboardId) {
        socket.emit('join_dashboard', dashboardId);
        setActiveDashboardId(dashboardId);
        console.log(`📡 Joined dashboard room: ${dashboardId}`);
      }
    },
    [socket, connected]
  );

  /**
   * Leave a dashboard's comment room
   */
  const leaveDashboard = useCallback(
    (dashboardId) => {
      if (socket && connected && dashboardId) {
        socket.emit('leave_dashboard', dashboardId);
        setActiveDashboardId(null);
        console.log(`🚪 Left dashboard room: ${dashboardId}`);
      }
    },
    [socket, connected]
  );

  /**
   * Send a new comment
   */
  const sendComment = useCallback(
    (dashboardId, message) => {
      if (!socket || !connected) return;
      socket.emit('new_comment', { dashboardId, message });
    },
    [socket, connected]
  );

  /**
   * Listen for socket events
   */
  const subscribeToComments = useCallback(
    (onNew, onUpdate, onDelete) => {
      if (!socket) return;

      if (onNew) socket.on('new_comment', onNew);
      if (onUpdate) socket.on('comment_updated', onUpdate);
      if (onDelete) socket.on('comment_deleted', onDelete);

      // Cleanup when unsubscribed
      return () => {
        if (onNew) socket.off('new_comment', onNew);
        if (onUpdate) socket.off('comment_updated', onUpdate);
        if (onDelete) socket.off('comment_deleted', onDelete);
      };
    },
    [socket]
  );

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        activeDashboardId,
        joinDashboard,
        leaveDashboard,
        sendComment,
        subscribeToComments,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
