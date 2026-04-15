// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import API from "../services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", { name, email, password, role });
      navigate("/verify");
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
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
            <h2 className="text-2xl font-outfit font-bold text-heading">Create Account</h2>
            <p className="text-muted text-sm mt-1">Start your journey with us</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm text-center mb-4">{error}</div>
          )}

          <form onSubmit={handleSignup} className="space-y-4" id="signup-form">
            <div>
              <label className="block text-sm text-gray-600 mb-2">Full Name</label>
              <input type="text" placeholder="Niko Kadi" value={name} onChange={(e) => setName(e.target.value)} required id="signup-name-input"
                className="w-full bg-blue-5 border border-blue-20 rounded-xl px-4 py-3 text-heading text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Email</label>
              <input type="email" placeholder="nikokadi@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required id="signup-email-input"
                className="w-full bg-blue-5 border border-blue-20 rounded-xl px-4 py-3 text-heading text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required id="signup-password-input"
                className="w-full bg-blue-5 border border-blue-20 rounded-xl px-4 py-3 text-heading text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">I am a</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setRole("user")}
                  className={`py-3 rounded-xl text-sm font-medium border transition-all ${role === "user" ? "bg-blue-5 border-primary text-primary" : "bg-white border-blue-20 text-gray-500 hover:border-primary-lighter"}`}>
                  🎫 Attendee
                </button>
                <button type="button" onClick={() => setRole("organizer")}
                  className={`py-3 rounded-xl text-sm font-medium border transition-all ${role === "organizer" ? "bg-emerald-50 border-emerald-400 text-emerald-700" : "bg-white border-blue-20 text-gray-500 hover:border-primary-lighter"}`}>
                  🎯 Organizer
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} id="signup-submit-btn"
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-all shadow-glow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {loading ? <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Creating account...</> : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-muted mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:text-primary-dark transition-colors">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}