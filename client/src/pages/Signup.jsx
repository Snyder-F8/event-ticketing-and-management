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
      await API.post("/auth/register", {
        name: name.trim(),
        email: email.trim(),
        password,
        role: role || "user",
      });

      // reset form (good UX)
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");

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

          {/* Header */}
          <div className="text-center mb-6">
            <img src={logo} alt="Logo" className="h-14 mx-auto mb-3 object-contain" />
            <h2 className="text-2xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 text-sm mt-1">
              Start your journey with us
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-sm text-center mb-4">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">

            {/* Name */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Email
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm text-gray-600 mb-2">
                I am a
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`py-3 rounded-xl text-sm font-medium border transition ${
                    role === "user"
                      ? "bg-blue-100 border-blue-500 text-blue-600"
                      : "bg-white text-gray-500"
                  }`}
                >
                  🎫 Attendee
                </button>

                <button
                  type="button"
                  onClick={() => setRole("organizer")}
                  className={`py-3 rounded-xl text-sm font-medium border transition ${
                    role === "organizer"
                      ? "bg-green-100 border-green-500 text-green-600"
                      : "bg-white text-gray-500"
                  }`}
                >
                  🎯 Organizer
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex justify-center items-center"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-blue-600 font-medium hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}