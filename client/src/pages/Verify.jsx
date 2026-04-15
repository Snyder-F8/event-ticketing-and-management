import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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

  const verificationStarted = useRef(false);

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
      const res = await API.post("/auth/verify-email", {
        token: tokenValue,
      });

      setSuccess("Email verified successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(
        err.response?.data?.error || "Invalid or expired verification link"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async (e) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await API.post("/auth/resend-verification", { email });
      setSuccess(res.data.message || "Verification email resent!");
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to resend verification email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center bg-surface-main px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-card border border-blue-20 p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <img src={logo} alt="Logo" className="h-14 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-heading">
            {token ? "Verifying Email..." : "Check Your Email"}
          </h2>
          <p className="text-sm text-muted mt-1">
            {token
              ? "Please wait while we confirm your account."
              : "We sent you a verification link. Click it to activate your account."}
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
          <div className="bg-green-50 border border-green-200 text-green-600 p-3 rounded-xl text-sm text-center mb-4">
            {success}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex justify-center my-6">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}

        {/* Resend form (only if no token) */}
        {!token && !success && (
          <form onSubmit={handleResend} className="space-y-4">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-blue-5 border border-blue-20 rounded-xl px-4 py-3 text-sm"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover text-white py-3 rounded-xl font-semibold disabled:opacity-50"
            >
              Resend Verification Email
            </button>
          </form>
        )}

        {/* Footer */}
        <p className="text-center text-sm text-muted mt-6">
          <Link
            to="/login"
            className="text-primary font-medium hover:text-primary-dark"
          >
            Return to Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}