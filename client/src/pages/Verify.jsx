// src/pages/Verify.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Verify() {
  const [message, setMessage] = useState("Verifying your account...");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // Get token from URL
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          setMessage("❌ Invalid verification link");
          return;
        }

        // Call backend
        const res = await API.post("/auth/verify", { token });

        setMessage("✅ Account verified successfully!");

        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);

      } catch (err) {
        setMessage(
          err.response?.data?.message || "❌ Verification failed"
        );
      }
    };

    verifyUser();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-xl rounded-xl p-8 text-center">
        <h2 className="text-xl font-semibold">{message}</h2>
      </div>
    </div>
  );
}