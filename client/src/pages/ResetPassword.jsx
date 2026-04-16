// src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.png";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");
    try {
      const res = await API.post("/auth/reset-password", { token, password });
      setMessage(res.data.message || "Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.error || "Invalid or expired reset token");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-main p-4">
        <div className="bg-white p-8 rounded-2xl shadow-card border border-blue-20 text-center max-w-md w-full">
           <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Request</h2>
           <p className="text-muted">No reset token found in the URL. Please use the link sent to your email.</p>
           <button onClick={() => navigate("/login")} className="mt-6 text-primary font-medium hover:underline">Back to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-surface-main px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card border border-blue-20 p-8 animate-fade-in-up">
          <div className="text-center mb-6">
            <img src={logo} alt="Logo" className="h-14 mx-auto mb-3 object-contain" />
            <h2 className="text-2xl font-outfit font-bold text-heading">Set New Password</h2>
            <p className="text-muted text-sm mt-1">Please enter your new secure password</p>
          </div>

          {message && <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm text-center mb-4">{message}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm text-center mb-4">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
                className="w-full bg-blue-5 border border-blue-20 rounded-xl px-4 py-3 text-heading text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Confirm New Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
                className="w-full bg-blue-5 border border-blue-20 rounded-xl px-4 py-3 text-heading text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
