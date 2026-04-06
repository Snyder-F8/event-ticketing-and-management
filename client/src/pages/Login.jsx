// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("organizer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
        role,
      });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);

        if (role === "admin") navigate("/admin");
        else navigate("/organizer");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white p-10">

        <img src={logo} alt="Logo" className="h-20 mb-6 object-contain" />

        <h1 className="text-4xl font-bold mb-4 text-center">
          Welcome Back
        </h1>

        <p className="text-lg text-center max-w-sm opacity-90">
          Manage your events and track ticket sales in real time.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-100 px-4">

        <div className="w-full max-w-md backdrop-blur-lg bg-white/80 shadow-2xl rounded-2xl p-8">

          <h2 className="text-2xl font-bold text-center text-gray-800">
            Login
          </h2>

          <p className="text-center text-gray-500 text-sm mb-6">
            Access your dashboard
          </p>

          {error && (
            <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />

            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg"
            >
              <option value="organizer">Organizer</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-500">
            Don’t have an account?{" "}
            <Link to="/" className="text-blue-600 font-medium hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}