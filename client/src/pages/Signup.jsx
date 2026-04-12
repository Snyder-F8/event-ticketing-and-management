import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";
import API from "../services/api";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        role: "Organizer",
      });

      const token = res.data?.verification_token;

      if (!token) {
        setError("Verification token not received from backend");
        return;
      }

      navigate(`/verify?token=${token}`);
    } catch (err) {
      setError(err.response?.data?.error || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white p-10">
        <img src={logo} className="h-20 mb-6" />
        <h1 className="text-4xl font-bold">Ticket Vibez</h1>
      </div>

      <div className="flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">

          {error && <p className="text-red-600 bg-red-100 p-2 mb-3">{error}</p>}

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />

            <input
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />

            <button className="w-full bg-blue-600 text-white py-2 rounded">
              Sign Up
            </button>
          </form>

          <p className="text-center mt-4 text-sm">
            Already have account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}