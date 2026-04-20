// src/pages/MyTicketsPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaTicketAlt, FaCalendarAlt, FaMapMarkerAlt, FaCheckCircle, FaClock, FaTimesCircle, FaDownload } from "react-icons/fa";
import API from "../services/api";
import { TicketCardSkeleton } from "../components/LoadingSkeleton";
import { QRCodeSVG } from "qrcode.react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const statusConfig = {
  confirmed: { icon: <FaCheckCircle />, color: "text-green-600", bg: "bg-green-50 border-green-200", label: "Confirmed" },
  pending: { icon: <FaClock />, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-200", label: "Pending" },
  cancelled: { icon: <FaTimesCircle />, color: "text-red-600", bg: "bg-red-50 border-red-200", label: "Cancelled" },
};
const filterOptions = ["All", "Confirmed", "Pending", "Cancelled"];

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [expandedTicket, setExpandedTicket] = useState(null);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    fetchTickets();
  }, [token]);

  const fetchTickets = async () => {
    setLoading(true);
    try { const res = await API.get("/api/tickets/my-tickets?per_page=50"); setTickets(res.data.tickets || []); }
    catch { /* empty */ }
    finally { setLoading(false); }
  };

  const filtered = filter === "All" ? tickets : tickets.filter((t) => t.status?.toLowerCase() === filter.toLowerCase());

  const downloadPDF = async (ticketId) => {
    const element = document.getElementById(`ticket-card-${ticketId}`);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
      pdf.save(`Ticket-${ticketId}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-surface-main">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="font-outfit font-bold text-3xl text-heading mb-2">My <span className="gradient-text">Tickets</span></h1>
          <p className="text-muted text-sm">Manage your event tickets</p>
        </div>
        <div className="flex gap-2 mb-6" id="ticket-filter-pills">
          {filterOptions.map((opt) => (
            <button key={opt} onClick={() => setFilter(opt)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${filter === opt ? "bg-primary text-white shadow-glow" : "bg-white border border-blue-20 text-gray-600 hover:text-primary hover:border-primary-lighter"}`}>
              {opt}{opt !== "All" && <span className="ml-1.5 text-xs opacity-70">({tickets.filter((t) => t.status?.toLowerCase() === opt.toLowerCase()).length})</span>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <TicketCardSkeleton key={i} />)}</div>
        ) : filtered.length > 0 ? (
          <div className="space-y-4 stagger-children">
            {filtered.map((ticket) => {
              const config = statusConfig[ticket.status?.toLowerCase()] || statusConfig.pending;
              const isExpanded = expandedTicket === ticket.id;
              return (
                <div key={ticket.id} id={`ticket-card-${ticket.id}`} className="rounded-2xl border border-blue-20 bg-white overflow-hidden hover:border-primary-lighter hover:shadow-card-hover transition-all duration-300 animate-fade-in-up">
                  <button onClick={() => setExpandedTicket(isExpanded ? null : ticket.id)} className="w-full p-5 flex items-start gap-4 text-left">
                    <div className="w-14 h-14 rounded-xl bg-blue-5 border border-blue-20 flex items-center justify-center flex-shrink-0">
                      <FaTicketAlt className="text-xl text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-heading truncate">{ticket.event?.title || "Event"}</h3>
                        <span className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${config.bg} ${config.color}`}>{config.icon} {config.label}</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><FaCalendarAlt className="text-xs text-primary" />{ticket.event?.event_date || "TBA"}</span>
                        <span className="flex items-center gap-1"><FaMapMarkerAlt className="text-xs text-primary-dark" />{ticket.event?.location || "TBA"}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="text-muted">{ticket.ticket_type?.name || "General"} · x{ticket.quantity}</span>
                        <span className="text-heading font-medium">KES {ticket.total_amount?.toLocaleString() || "0"}</span>
                      </div>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-blue-10 pt-4 animate-fade-in">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><p className="text-muted text-xs mb-1">Ticket Code</p><p className="text-heading font-mono font-medium">{ticket.ticket_code}</p></div>
                        <div><p className="text-muted text-xs mb-1">Purchased</p><p className="text-heading">{ticket.purchased_at || "—"}</p></div>
                        <div><p className="text-muted text-xs mb-1">Payment</p><p className="text-heading capitalize">{ticket.payment?.status || "—"}</p></div>
                        <div><p className="text-muted text-xs mb-1">M-Pesa Code</p><p className="text-heading font-mono">{ticket.payment?.mpesa_code || "—"}</p></div>
                      </div>
                      {ticket.status === "confirmed" && (
                        <div className="mt-4 pt-4 border-t border-blue-10 flex flex-col sm:flex-row items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className="w-24 h-24 rounded-xl bg-white border border-blue-20 p-2 flex items-center justify-center">
                              <QRCodeSVG 
                                value={ticket.ticket_code || "INVALID"} 
                                size={80}
                                bgColor={"#ffffff"}
                                fgColor={"#010c1d"}
                                level={"L"}
                                includeMargin={false}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-heading font-medium">Show this at the venue</p>
                              <p className="text-xs text-muted mt-1 font-mono">Ticket: {ticket.ticket_code}</p>
                            </div>
                          </div>
                          
                          <button 
                            onClick={(e) => { e.stopPropagation(); downloadPDF(ticket.id); }}
                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-5 text-primary text-sm font-medium hover:bg-blue-10 transition-colors border border-blue-20"
                          >
                            <FaDownload size={12} /> Download PDF
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-5 border border-blue-20 flex items-center justify-center mb-4"><FaTicketAlt className="text-2xl text-blue-20" /></div>
            <h3 className="text-lg font-outfit font-semibold text-heading mb-2">{filter === "All" ? "No Tickets Yet" : `No ${filter} Tickets`}</h3>
            <p className="text-sm text-muted mb-6">{filter === "All" ? "Start by browsing events and grabbing some tickets!" : "No tickets with this status found."}</p>
            <Link to="/events" className="px-6 py-2.5 rounded-lg bg-blue-5 text-primary text-sm font-medium hover:bg-blue-10 transition-colors">Browse Events</Link>
          </div>
        )}
      </div>
    </div>
  );
}
