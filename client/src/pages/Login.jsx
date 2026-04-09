// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Role selection
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send role along with email & password
      const res = await API.post("/auth/login", { email, password, role });

      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);

        // Navigate according to backend-confirmed role
        if (res.data.user.role === "admin") {
          navigate("/admin");
        } else if (res.data.user.role === "organizer") {
          navigate("/organizer");
        } else {
          setError("Unknown role. Contact support.");
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* Left */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white p-10">
        <img src={logo} alt="Logo" className="h-20 mb-6 object-contain" />
        <h1 className="text-4xl font-bold mb-4 text-center">Welcome Back</h1>
        <p className="text-lg text-center max-w-sm opacity-90">
          Manage your events and track ticket sales in real time.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md backdrop-blur-lg bg-white/80 shadow-2xl rounded-2xl p-8">
          {error && <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Role selection */}
            <div>
              <label className="block mb-2 font-medium text-gray-700">Login as:</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="organizer">Organizer</option>
              </select>
            </div>

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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-500">
            Don’t have an account?{" "}
            <Link to="/" className="text-blue-600 font-medium hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}