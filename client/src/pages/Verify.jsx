// src/pages/Verify.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import API from "../services/api";

export default function Verify() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Pre-fill email if passed from signup
  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/auth/verify", { email });

      if (res.status === 200) {
        setSuccess("Verification successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
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
            <img src={logo} alt="Logo" className="h-14 mx-auto mb-3 object-contain" />
            <h2 className="text-2xl font-outfit font-bold text-heading">
              Verify Your Email
            </h2>
            <p className="text-muted text-sm mt-1">
              We sent a verification link to your email
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm text-center mb-4">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl text-sm text-center mb-4">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleVerify} className="space-y-4">

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
                  Verifying...
                </>
              ) : (
                "Verify"
              )}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-muted mt-6">
            Already verified?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:text-primary-dark transition-colors"
            >
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}