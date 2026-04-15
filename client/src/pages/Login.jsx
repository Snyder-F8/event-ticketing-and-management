// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import logo from "../assets/logo.png";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await API.post("/auth/login", { email, password, role });
      if (res.status === 200) {
        dispatch(loginSuccess({ token: res.data.access_token || res.data.token, user: res.data.user }));
        const userRole = res.data.user.role?.toLowerCase();
        if (userRole === "admin") navigate("/admin");
        else if (userRole === "organizer") navigate("/organizer");
        else navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-surface-main px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card border border-blue-20 p-8 animate-fade-in-up">
          <div className="text-center mb-6">
            <img src={logo} alt="Logo" className="h-14 mx-auto mb-3 object-contain" />
            <h2 className="text-2xl font-outfit font-bold text-heading">Welcome Back</h2>
            <p className="text-muted text-sm mt-1">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm text-center mb-4">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" id="login-form">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Login as</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} required id="login-role-select"
                className="w-full bg-blue-5 border border-blue-20 rounded-xl px-4 py-3 text-heading text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer">
                <option value="">Select Role</option>
                <option value="user">Attendee</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required id="login-email-input"
                className="w-full bg-blue-5 border border-blue-20 rounded-xl px-4 py-3 text-heading text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required id="login-password-input"
                className="w-full bg-blue-5 border border-blue-20 rounded-xl px-4 py-3 text-heading text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-primary hover:text-primary-dark transition-colors">Forgot password?</Link>
            </div>
            <button type="submit" disabled={loading} id="login-submit-btn"
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Signing in...</> : "Sign In"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:text-primary-dark transition-colors">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}