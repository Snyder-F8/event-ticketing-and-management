import React, { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import logo from "../assets/logo.png";
import API from "../services/api";

export default function Verify() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token"); // ✅ Extract token from URL

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // ❌ No token in URL
    if (!token) {
      setError("Invalid or missing verification token");
      setLoading(false);
      return;
    }

    try {
      const res = await API.post("/auth/verify-email", {
        token: token, // ✅ Send token to correct backend route
      });

      console.log("VERIFY SUCCESS:", res.data);

      if (res.status === 200) {
        setSuccess("Account verified successfully! Redirecting to login...");

        // ⏳ Small delay before redirect
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      }
    } catch (err) {
      console.log("VERIFY ERROR:", err.response?.data);

      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Verification failed"
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
          Verify Account
        </h1>
        <p className="text-lg text-center max-w-sm opacity-90">
          Click verify to activate your account.
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

          {success && (
            <p className="bg-green-100 text-green-600 p-2 rounded mb-4 text-center">
              {success}
            </p>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <h2 className="text-2xl font-bold text-center mb-4">
              Verify Account
            </h2>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify Account"}
            </button>
          </form>

          <p className="text-center text-sm mt-6 text-gray-500">
            Already verified?{" "}
            <Link to="/login" className="text-blue-600 font-medium hover:underline">
              Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}