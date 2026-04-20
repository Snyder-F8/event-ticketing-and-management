// src/pages/Verify.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import logo from "../assets/logo.png";
import API from "../services/api";

export default function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const verificationStarted = React.useRef(false);

  useEffect(() => {
    if (token && !verificationStarted.current) {
      verificationStarted.current = true;
      handleTokenVerification(token);
    }
  }, [token]);

  const handleTokenVerification = async (tokenValue) => {
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      // const res = await API.post("/auth/verify-email", { token: tokenValue });
      // Use GET request with token in the URL path
      const res = await API.get(`/auth/verify-email/${tokenValue}`);
      setError(""); // Clear any previous error
      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      // If we already have success (from a previous call that won the race), don't show error
       if (!success) {
          setError(err.response?.data?.error || "Invalid or expired verification link");
       }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) {
       setError("Please enter your email address to resend the link.");
       return;
    }
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await API.post("/auth/resend-verification", { email });
      setSuccess(res.data.message || "A new verification link has been sent!");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to resend verification email");
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
            <h2 className="text-2xl font-outfit font-bold text-heading">
              {token ? "Verifying Email..." : "Check Your Email"}
            </h2>
            <p className="text-muted text-sm mt-1">
              {token 
                ? "Please wait while we confirm your account." 
                : "We've sent a verification link to your email address. Please click the link to activate your account."}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm text-center mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-xl text-sm text-center mb-4">
              {success}
            </div>
          )}

          {loading && (
            <div className="flex justify-center my-8">
              <div className="w-10 h-10 rounded-full border-4 border-primary/30 border-t-primary animate-spin" />
            </div>
          )}

          {!token && !success && (
            <form onSubmit={handleResend} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider font-semibold">
                  Didn't receive an email?
                </label>
                <div className="flex gap-2">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                    className="flex-grow bg-blue-5 border border-blue-20 rounded-xl px-4 py-3 text-heading text-sm placeholder-gray-400 focus:outline-none focus:border-primary transition-all" 
                  />
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-50"
                  >
                    Resend
                  </button>
                </div>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-muted mt-8">
            <Link to="/login" className="text-primary font-medium hover:text-primary-dark transition-colors">
              Return to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}