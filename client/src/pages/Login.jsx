import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      // Flexible backend support
      const token =
        res.data.token ||
        res.data.access_token ||
        res.data.accessToken;

      const user =
        res.data.user ||
        res.data.data?.user ||
        null;

      const role = (
        user?.role ||
        res.data.role ||
        res.data.user_role ||
        ""
      ).toLowerCase();

      // VALIDATION
      if (!token) {
        throw new Error("Token missing in backend response");
      }

      if (!role) {
        throw new Error("Role missing in backend response");
      }

      // STORE AUTH DATA
      localStorage.setItem("token", token);
      localStorage.setItem("role", role);

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }

      // ROLE ROUTING
      setTimeout(() => {
        if (role === "admin") {
          navigate("/admin");
        } else if (role === "organizer") {
          navigate("/organizer");
        } else if (role === "user") {
          navigate("/dashboard");
        } else {
          setError("Unknown role: " + role);
        }
      }, 100);

    } catch (err) {
      console.error("LOGIN ERROR:", err);

      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Login failed. Please check your credentials."
      );
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
          Manage your events and tickets seamlessly.
        </p>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-8">

          {error && (
            <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            <h2 className="text-2xl font-bold text-center mb-4">
              Login
            </h2>

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>

          <p className="text-center text-sm mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-600 font-medium">
              Sign Up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}