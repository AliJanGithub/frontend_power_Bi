import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../../lib/api"; // adjust this import if your api file is elsewhere
import { Button } from "../ui/button";

export function AcceptInvitePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setMessage("Invalid or missing invite token.");
    }
  }, [token]);

  const handleAcceptInvite = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/accept-invite", {
        token,
        email,
        password,
      });

      setMessage("Invite accepted successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to accept invite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">
          Accept Your Invite
        </h2>

        {message && (
          <div className="text-center text-sm text-blue-600 mb-3">{message}</div>
        )}

        <form onSubmit={handleAcceptInvite} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mt-1 focus:ring focus:ring-blue-200"
              placeholder="Create a password"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Processing..." : "Accept Invite"}
          </Button>
        </form>
      </div>
    </div>
  );
}
