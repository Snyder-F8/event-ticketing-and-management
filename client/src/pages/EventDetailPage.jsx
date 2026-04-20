// src/pages/EventDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCalendarAlt, FaMapMarkerAlt, FaUser, FaTicketAlt, FaMinus, FaPlus, FaArrowLeft, FaShareAlt, FaHeart } from "react-icons/fa";
import API from "../services/api";
import { getStubEvent, stubEvents } from "../data/stubEvents";
import { PageSkeleton } from "../components/LoadingSkeleton";
import EventCard from "../components/EventCard";
import { getEventImage, DEFAULT_IMAGE } from "../utils/imageHelper";

function getTicketTypeStyle(name) {
  const n = name?.toLowerCase() || "";
  if (n.includes("mvp") || n.includes("vip")) return { border: "border-amber-200", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-700" };
  if (n.includes("early")) return { border: "border-emerald-200", bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" };
  return { border: "border-blue-20", bg: "bg-blue-5", badge: "bg-blue-10 text-primary-dark" };
}

export default function EventDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const [relatedEvents, setRelatedEvents] = useState([]);

  useEffect(() => { window.scrollTo(0, 0); fetchEvent(); }, [id]);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/api/events/${id}`);
      initEvent(res.data.event);
    } catch {
      const stub = getStubEvent(id);
      if (stub) initEvent(stub);
      else setEvent(null);
    }
    setLoading(false);
  };

  const initEvent = (evt) => {
    setEvent(evt);
    const init = {};
    evt.ticket_types?.forEach((t) => { init[t.id] = 0; });
    setQuantities(init);
    setRelatedEvents(stubEvents.filter((e) => e.id !== parseInt(id)).slice(0, 3));
  };

  const updateQty = (typeId, delta) => {
    setQuantities((prev) => ({ ...prev, [typeId]: Math.max(0, Math.min(10, (prev[typeId] || 0) + delta)) }));
  };

  const getTotal = () => event?.ticket_types?.reduce((sum, t) => sum + t.price * (quantities[t.id] || 0), 0) || 0;
  const getSelected = () => event?.ticket_types?.filter((t) => (quantities[t.id] || 0) > 0).map((t) => ({ ...t, selectedQuantity: quantities[t.id] })) || [];

  const handleCheckout = () => {
    const sel = getSelected();
    if (!sel.length) return;
    if (!token) { navigate("/login"); return; }
    sessionStorage.setItem("checkoutData", JSON.stringify({
      event: { id: event.id, title: event.title, event_date: event.event_date, location: event.location },
      tickets: sel, total: getTotal(),
    }));
    navigate("/checkout");
  };

  if (loading) return <PageSkeleton />;
  if (!event) return (
    <div className="min-h-screen bg-surface-main flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-outfit font-bold text-heading mb-2">Event Not Found</h2>
        <p className="text-muted mb-4">This event may have been removed.</p>
        <Link to="/events" className="text-primary hover:text-primary-dark text-sm">← Browse Events</Link>
      </div>
    </div>
  );

  const eventImage = getEventImage(event.images?.[0]?.image_url);
  const total = getTotal();
  const hasSelections = total > 0;

  return (
    <div className="min-h-screen bg-surface-main">
      {/* Hero */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden" id="event-detail-hero">
        <img src={eventImage} alt={event.title} className="w-full h-full object-cover" onError={(e) => { e.target.src = DEFAULT_IMAGE; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/90 backdrop-blur-sm text-sm text-heading hover:bg-white transition-colors z-10 shadow-sm">
          <FaArrowLeft size={12} /> Back
        </button>
        <div className="absolute top-6 right-6 flex gap-2 z-10">
          <button className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-heading hover:bg-white transition-colors shadow-sm"><FaShareAlt size={14} /></button>
          <button className="w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-heading hover:text-red-500 hover:bg-white transition-colors shadow-sm"><FaHeart size={14} /></button>
        </div>
        <div className="absolute bottom-6 left-6 flex gap-2 z-10">
          {event.categories?.map((cat) => (
            <span key={cat} className="px-3 py-1 rounded-full bg-primary text-white text-xs font-semibold shadow-sm">{cat}</span>
          ))}
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="animate-fade-in-up">
              <h1 className="font-outfit font-bold text-3xl md:text-4xl text-heading mb-4">{event.title}</h1>
              <div className="flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-blue-20 shadow-sm">
                  <FaCalendarAlt className="text-primary" /><span className="text-gray-700">{event.event_date || "TBA"}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-blue-20 shadow-sm">
                  <FaMapMarkerAlt className="text-primary-dark" /><span className="text-gray-700">{event.location || "TBA"}</span>
                </div>
                {event.organizer && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-blue-20 shadow-sm">
                    <FaUser className="text-primary" /><span className="text-gray-700">{event.organizer.name}</span>
                  </div>
                )}
              </div>
            </div>

            {event.description && (
              <div className="animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
                <h2 className="font-outfit font-semibold text-xl text-heading mb-3">About This Event</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>
            )}

            {/* Ticket Types */}
            <div className="animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <h2 className="font-outfit font-semibold text-xl text-heading mb-4 flex items-center gap-2">
                <FaTicketAlt className="text-primary" /> Select Tickets
              </h2>
              <div className="space-y-4">
                {event.ticket_types?.map((type) => {
                  const style = getTicketTypeStyle(type.name);
                  const qty = quantities[type.id] || 0;
                  return (
                    <div key={type.id} className={`p-5 rounded-2xl border ${style.border} ${style.bg} transition-all duration-300`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-heading">{type.name}</h3>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${style.badge}`}>
                              {type.is_sold_out ? "Sold Out" : `${type.tickets_remaining} left`}
                            </span>
                          </div>
                          <p className="text-2xl font-outfit font-bold text-heading mt-1">
                            {type.price === 0 ? "Free" : `KES ${type.price.toLocaleString()}`}
                          </p>
                        </div>
                        {!type.is_sold_out && (
                          <div className="flex items-center gap-3">
                            <button onClick={() => updateQty(type.id, -1)} disabled={qty === 0}
                              className="w-9 h-9 rounded-lg border border-blue-20 flex items-center justify-center text-heading hover:bg-blue-5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                              <FaMinus size={10} />
                            </button>
                            <span className="w-8 text-center text-heading font-semibold">{qty}</span>
                            <button onClick={() => updateQty(type.id, 1)} disabled={qty >= Math.min(10, type.tickets_remaining)}
                              className="w-9 h-9 rounded-lg border border-blue-20 flex items-center justify-center text-heading hover:bg-blue-5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
                              <FaPlus size={10} />
                            </button>
                          </div>
                        )}
                      </div>
                      {qty > 0 && (
                        <div className="mt-3 pt-3 border-t border-blue-20/50 flex justify-between text-sm">
                          <span className="text-muted">{qty}x {type.name}</span>
                          <span className="text-heading font-medium">KES {(type.price * qty).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-blue-20 bg-white p-6 space-y-4 shadow-card animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
                <h3 className="font-outfit font-semibold text-lg text-heading">Order Summary</h3>
                {hasSelections ? (
                  <>
                    <div className="space-y-2">
                      {getSelected().map((t) => (
                        <div key={t.id} className="flex justify-between text-sm">
                          <span className="text-gray-500">{t.selectedQuantity}x {t.name}</span>
                          <span className="text-heading font-medium">KES {(t.price * t.selectedQuantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="pt-3 border-t border-blue-10 flex justify-between">
                      <span className="text-heading font-semibold">Total</span>
                      <span className="text-xl font-outfit font-bold gradient-text">KES {total.toLocaleString()}</span>
                    </div>
                    <button onClick={handleCheckout}
                      className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-all shadow-glow" id="proceed-checkout-btn">
                      Proceed to Checkout
                    </button>
                  </>
                ) : (
                  <div className="py-6 text-center">
                    <FaTicketAlt className="text-3xl text-blue-20 mx-auto mb-3" />
                    <p className="text-sm text-muted">Select tickets to see your order summary</p>
                  </div>
                )}
                {!token && <p className="text-xs text-muted text-center">You'll need to <Link to="/login" className="text-primary hover:underline">login</Link> to purchase tickets</p>}
              </div>
            </div>
          </div>
        </div>

        {relatedEvents.length > 0 && (
          <section className="mt-16 pt-12 border-t border-blue-20">
            <h2 className="font-outfit font-bold text-xl text-heading mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedEvents.map((e, i) => <EventCard key={e.id} event={e} index={i} />)}
            </div>
          </section>
        )}
      </div>

      {hasSelections && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-blue-20 p-4 shadow-lg" id="mobile-checkout-bar">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted">Total</p>
              <p className="text-lg font-outfit font-bold gradient-text">KES {total.toLocaleString()}</p>
            </div>
            <button onClick={handleCheckout} className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold transition-all shadow-glow">Checkout</button>
          </div>
        </div>
      )}
    </div>
  );
}
