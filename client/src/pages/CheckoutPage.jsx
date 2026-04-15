// src/pages/CheckoutPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaArrowLeft, FaCheckCircle, FaTimesCircle, FaShieldAlt } from "react-icons/fa";
import API from "../services/api";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [checkoutData, setCheckoutData] = useState(null);
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    const data = sessionStorage.getItem("checkoutData");
    if (!data) { navigate("/events"); return; }
    setCheckoutData(JSON.parse(data));
  }, [token, navigate]);

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    try {
      for (const ticket of checkoutData.tickets) {
        await API.post("/api/tickets", { ticket_type_id: ticket.id, quantity: ticket.selectedQuantity, phone_number: phone });
      }
      setStatus("success");
      sessionStorage.removeItem("checkoutData");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.response?.data?.error || err.message || "Payment failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!checkoutData) return (
    <div className="min-h-screen bg-surface-main flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-4 border-blue-20 border-t-primary animate-spin" />
    </div>
  );

  if (status === "success") return (
    <div className="min-h-screen bg-surface-main flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-scale-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-50 border border-green-200 flex items-center justify-center mb-6">
          <FaCheckCircle className="text-4xl text-green-500" />
        </div>
        <h2 className="font-outfit font-bold text-2xl text-heading mb-3">Payment Initiated!</h2>
        <p className="text-gray-600 mb-2">Check your phone for the M-Pesa prompt.</p>
        <p className="text-sm text-muted mb-8">Complete the payment on your phone to confirm your tickets.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/my-tickets" className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-all shadow-glow">View My Tickets</Link>
          <Link to="/events" className="px-6 py-3 rounded-xl border border-blue-20 text-gray-700 hover:bg-blue-5 font-medium transition-all">Browse More Events</Link>
        </div>
      </div>
    </div>
  );

  if (status === "error") return (
    <div className="min-h-screen bg-surface-main flex items-center justify-center px-4">
      <div className="text-center max-w-md animate-scale-in">
        <div className="w-20 h-20 mx-auto rounded-full bg-red-50 border border-red-200 flex items-center justify-center mb-6">
          <FaTimesCircle className="text-4xl text-red-500" />
        </div>
        <h2 className="font-outfit font-bold text-2xl text-heading mb-3">Payment Failed</h2>
        <p className="text-gray-600 mb-6">{errorMsg}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button onClick={() => setStatus(null)} className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-all shadow-glow">Try Again</button>
          <Link to="/events" className="px-6 py-3 rounded-xl border border-blue-20 text-gray-700 hover:bg-blue-5 font-medium transition-all">Back to Events</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface-main">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors mb-8">
          <FaArrowLeft size={12} /> Back to event
        </button>
        <h1 className="font-outfit font-bold text-3xl text-heading mb-8" id="checkout-title">Checkout</h1>
        <div className="grid md:grid-cols-5 gap-8">
          <div className="md:col-span-3 space-y-6">
            <div className="rounded-2xl border border-blue-20 bg-white p-5 shadow-card">
              <h3 className="font-outfit font-semibold text-heading text-lg mb-3">{checkoutData.event.title}</h3>
              <div className="flex flex-wrap gap-3 text-sm text-gray-500">
                <div className="flex items-center gap-2"><FaCalendarAlt className="text-primary" />{checkoutData.event.event_date || "TBA"}</div>
                <div className="flex items-center gap-2"><FaMapMarkerAlt className="text-primary-dark" />{checkoutData.event.location || "TBA"}</div>
              </div>
            </div>
            <div className="rounded-2xl border border-blue-20 bg-white p-6 shadow-card">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><FaPhone className="text-green-600" /></div>
                <div><h3 className="font-outfit font-semibold text-heading">M-Pesa Payment</h3><p className="text-xs text-muted">Enter your Safaricom phone number</p></div>
              </div>
              <form onSubmit={handlePayment} id="mpesa-payment-form">
                <div className="mb-5">
                  <label className="block text-sm text-gray-600 mb-2">Phone Number</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm font-medium">+</span>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="254712345678" maxLength={12}
                      className="w-full bg-blue-5 border border-blue-20 rounded-xl py-3 pl-9 pr-4 text-heading text-sm placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" required id="mpesa-phone-input" />
                  </div>
                  <p className="text-xs text-muted mt-1.5">Format: 254XXXXXXXXX (e.g., 254712345678)</p>
                </div>
                <button type="submit" disabled={loading || phone.length < 12}
                  className="w-full py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2" id="pay-now-btn">
                  {loading ? <><div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />Processing...</> : <>Pay KES {checkoutData.total.toLocaleString()} via M-Pesa</>}
                </button>
              </form>
              <div className="flex items-center gap-2 mt-4 text-xs text-muted"><FaShieldAlt className="text-green-500" />Secure payment powered by Safaricom M-Pesa</div>
            </div>
          </div>
          <div className="md:col-span-2">
            <div className="rounded-2xl border border-blue-20 bg-white p-6 shadow-card md:sticky md:top-24">
              <h3 className="font-outfit font-semibold text-heading mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {checkoutData.tickets.map((t) => (
                  <div key={t.id} className="flex items-center justify-between text-sm">
                    <div><span className="text-gray-700">{t.name}</span><span className="text-muted ml-1">x{t.selectedQuantity}</span></div>
                    <span className="text-heading font-medium">KES {(t.price * t.selectedQuantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-4 border-t border-blue-10 flex justify-between items-center">
                <span className="text-heading font-semibold">Total</span>
                <span className="text-xl font-outfit font-bold gradient-text">KES {checkoutData.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
