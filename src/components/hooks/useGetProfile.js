import { useState } from "react";
import api from "../../lib/api";

export const useGetProfile = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    setError(null);
    setLoading(true);

    try {
      const response = await api.get("auth/me");
      const profileUser = response.data?.data?.user || {};

      console.log("Profile user inside hook:", profileUser);

      // Store safely in localStorage
      localStorage.setItem("profileuser", JSON.stringify(profileUser));

      return profileUser; // ✅ Return actual user object
    } catch (err) {
      console.error("Get profile failed:", err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    getProfile,
    error,
    loading,
  };
};
