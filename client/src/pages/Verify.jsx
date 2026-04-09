// src/pages/Verify.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import API from "../services/api";

export default function Verify() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await API.post("/auth/verify", { email });
      if (res.status === 200) navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">

      {/* Left */}
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white p-10">
        <img src={logo} alt="Logo" className="h-20 mb-6 object-contain" />
        <h1 className="text-4xl font-bold mb-4 text-center">Verify Account</h1>
        <p className="text-lg text-center max-w-sm opacity-90">
          Enter the email you registered to verify your account.
        </p>
      </div>

      {/* Right */}
      <div className="flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md backdrop-blur-lg bg-white/80 shadow-2xl rounded-2xl p-8">
          {error && <p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">{error}</p>}

          <form onSubmit={handleVerify} className="space-y-4">
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500" required />

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md hover:shadow-lg">
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-500">
            Already verified?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}