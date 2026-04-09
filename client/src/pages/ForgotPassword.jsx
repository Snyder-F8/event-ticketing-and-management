// src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
export default function ForgotPassword() {
const [email, setEmail] = useState("");
const [message, setMessage] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const handleSubmit = async (e) => {
e.preventDefault();
setLoading(true);
setError("");
setMessage("");
try {
const res = await API.post("/auth/forgot-password", { email });
setMessage(res.data.message || "Reset link sent to your email");
} catch (err) {
setError(err.response?.data?.message || "Something went wrong");
} finally {
setLoading(false);
}
};
return (
<div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] px-4">
<div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
<h2 className="text-2xl font-bold text-center text-[var(--text-heading)] mb-4">
Forgot Password
</h2>
{message && (
<p className="bg-green-100 text-green-700 p-2 rounded mb-4 text-center">
{message}
</p>
)}
{error && (
<p className="bg-red-100 text-red-600 p-2 rounded mb-4 text-center">
{error}
</p>
)}
<form onSubmit={handleSubmit} className="space-y-4">
<input
type="email"
placeholder="Email Address"
value={email}
onChange={(e) => setEmail(e.target.value)}
className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-[var(--primary)] outline-none"
required
/>
<button className="w-full bg-[var(--primary)] text-white py-2 rounded-lg hover:bg-[var(--primary-hover)] transition">
{loading ? "Sending..." : "Send Reset Link"}
</button>
</form>
<div className="text-center mt-4 text-sm">
<Link to="/login" className="text-[var(--primary)] hover:underline">
Back to Login
</Link>
</div>
</div>
</div>
);
}