// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import logo from "../assets/logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim()) return;

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await API.post("/auth/forgot-password", { email });

      setMessage(res.data.message || "Reset link sent to your email");

      // optional UX improvement: clear input after success
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-surface-main px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card border border-blue-20 p-8 animate-fade-in-up">

          {/* Header */}
          <div className="text-center mb-6">
            <img
              src={logo}
              alt="Logo"
              className="h-14 mx-auto mb-3 object-contain"
            />
            <h2 className="text-2xl font-outfit font-bold text-heading">
              Forgot Password
            </h2>
            <p className="text-muted text-sm mt-1">
              Enter your email to receive a reset link
            </p>
          </div>

          {/* Alerts */}
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm text-center mb-4">
              {message}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm text-center mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-blue-5 border border-blue-20 rounded-xl px-4 py-3 text-heading text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Sending...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>

          {/* Back Link */}
          <p className="text-center text-sm text-muted mt-6">
            <Link
              to="/login"
              className="text-primary font-medium hover:text-primary-dark transition-colors"
            >
              ← Back to Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}