import { useState, useEffect, useCallback } from 'react';
import api from '../../lib/api';
import { useSocket } from '../SocketContext'; // make sure the path matches your structure

export const useComments = (dashboardId) => {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { joinDashboard, leaveDashboard, subscribeToComments, sendComment } = useSocket();

  // 📥 Fetch all comments
  const fetchComments = useCallback(async () => {
    if (!dashboardId) return;
    try {
      setLoading(true);
      const res = await api.get(`/comments/dashboard/${dashboardId}`);
      console.log("777777777777777777777",res)
      setComments(res.data.data.comments || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [dashboardId]);

  // ➕ Create comment
  const createComment = async (message, parentId = null) => {
    console.log("comment  context",dashboardId,message)
    try {
      const res = await api.post(`/comments/dashboard/${dashboardId}`, { message, parentId });
      const newComment = res.data.data.comment;
      setComments((prev) => [...prev, newComment]);
      sendComment(dashboardId, newComment); // use your context’s emit method

      return newComment;
    } catch (err) {
 const msg = err.response?.data?.message || 'Failed to create comment';
  setError(msg);
  throw new Error(msg);    }
  };

  // ✏️ Update comment
  const updateComment = async (id, message) => {
    try {
      const res = await api.put(`/comments/${id}`, { message });
      const updated = res.data.data.comment;
      setComments((prev) => prev.map((c) => (c._id === id ? updated : c)));
      return updated;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update comment');
    }
  };

  // ❌ Delete comment
  const deleteComment = async (id) => {
    try {
      await api.delete(`/comments/${id}`);
      setComments((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment');
    }
  };

  // 🔁 Join / Leave socket room when dashboard changes
  useEffect(() => {
    if (!dashboardId) return;
    joinDashboard(dashboardId);
    return () => leaveDashboard(dashboardId);
  }, [dashboardId, joinDashboard, leaveDashboard]);

  // 🔊 Subscribe to live socket updates
  useEffect(() => {
    if (!dashboardId) return;

    const unsubscribe = subscribeToComments(
      (newComment) => setComments((prev) => [...prev, newComment]),
      (updatedComment) =>
        setComments((prev) => prev.map((c) => (c._id === updatedComment._id ? updatedComment : c))),
      (deletedId) => setComments((prev) => prev.filter((c) => c._id !== deletedId))
    );

    return () => unsubscribe?.();
  }, [dashboardId, subscribeToComments]);

  // 🚀 Initial fetch
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loadingComments,
    error,
    createComment,
    updateComment,
    deleteComment,
    fetchComments,
  };
};
