// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import {
  FaHome,
  FaCalendarAlt,
  FaUserShield,
  FaSignOutAlt,
  FaSearch,
  FaBell,
  FaBars,
  FaUsers,
  FaTicketAlt,
  FaChartLine,
  FaCheckCircle,
  FaStopCircle,
  FaMoneyBillWave,
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Chart } from "chart.js";
import logo from "../assets/logo.png";
import API from "../services/api";

// Chart Defaults
Chart.defaults.font.family = "Outfit, sans-serif";
Chart.defaults.color = "#6B7280";
Chart.defaults.scale.grid.color = "rgba(76, 140, 247, 0.05)";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);
  
  const [users, setUsers] = useState([]);
  const [dashboardData, setDashboardData] = useState({
    totalEvents: 24,
    pendingApprovals: 5,
    ticketsSold: 1200,
    totalRevenue: 45000,
  });

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [loadingTickets, setLoadingTickets] = useState(false);

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [
      {
        label: "Platform Revenue (KES)",
        data: [12000, 19000, 15000, 30000, 25000, 42000, 45000],
        backgroundColor: "rgba(76, 140, 247, 0.1)",
        borderColor: "#4C8CF7",
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#4C8CF7",
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const ticketsData = {
    labels: ["Music", "Tech", "Sports", "Art", "Food"],
    datasets: [
      {
        label: "Tickets Sold by Category",
        data: [450, 300, 150, 200, 100],
        backgroundColor: [
          "#4C8CF7", // primary
          "#10b981", // emerald
          "#f59e0b", // amber
          "#8b5cf6", // violet
          "#ef4444", // red
        ],
        borderRadius: 6,
        barThickness: 32,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(1, 12, 29, 0.9)",
        titleFont: { size: 13 },
        bodyFont: { size: 14, weight: "bold" },
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      y: { beginAtZero: true, border: { display: false } },
      x: { border: { display: false }, grid: { display: false } },
    },
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data.users || []);
      setDashboardData(prev => ({ ...prev, totalUsers: res.data.total }));
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  const fetchEvents = async () => {
    setLoadingEvents(true);
    try {
      const res = await API.get("/api/events/all");
      const fetchedEvents = res.data.events || [];
      setEvents(fetchedEvents);
      const pendingCount = fetchedEvents.filter(e => e.status === "pending").length;
      setDashboardData(prev => ({ 
        ...prev, 
        totalEvents: fetchedEvents.length,
        pendingApprovals: pendingCount
      }));
    } catch (err) {
      console.error("Failed to fetch events:", err.response?.data || err);
      if (err.response?.status === 401) navigate("/login");
    } finally {
      setLoadingEvents(false);
    }
  };

  const fetchTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await API.get("/api/tickets/manage/all");
      const fetchedTickets = res.data.tickets || [];
      setTickets(fetchedTickets);
      const confirmedTickets = fetchedTickets.filter(t => t.status === "confirmed");
      const revenue = confirmedTickets.reduce((sum, t) => sum + t.total_amount, 0);
      setDashboardData(prev => ({
        ...prev,
        ticketsSold: confirmedTickets.length,
        totalRevenue: revenue
      }));
    } catch (err) {
      console.error("Failed to fetch tickets:", err);
      alert("Failed to fetch tickets. Check console or backend logs.");
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    if (!token || user?.role !== "Admin") {
      navigate("/login");
      return;
    }
    fetchUsers();
    fetchEvents();
    fetchTickets();
  }, [token, user]);

  const handleStatusUpdate = async (eventId, action) => {
    try {
      const res = await API.patch(`/api/events/${eventId}/approve`, { action });
      // Update local state
      setEvents(prev => prev.map(e => e.id === eventId ? res.data.event : e));
      // Refresh stats
      setDashboardData(prev => {
        return {
          ...prev,
          pendingApprovals: Math.max(0, prev.pendingApprovals - 1)
        };
      });
    } catch (err) {
      console.error("Update status error:", err);
      alert("Failed to update event status.");
    }
  };

  const handleConfirmTicket = async (ticketId) => {
    try {
      await API.patch(`/api/tickets/manage/${ticketId}/confirm`);
      // Update local state
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status: "confirmed" } : t));
      alert("Ticket confirmed successfully.");
    } catch (err) {
      console.error("Confirm ticket error:", err);
      const msg = err.response?.data?.details || err.response?.data?.error || err.message;
      alert("Failed to confirm ticket: " + msg);
    }
  };

  // handleOrganizerApproval removed

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const sidebarLinks = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Events Approvals", icon: <FaCalendarAlt /> },
    { name: "Ticket Management", icon: <FaTicketAlt /> },
    { name: "User Management", icon: <FaUsers /> },
    { name: "Global Settings", icon: <FaUserShield /> },
  ];

  return (
    <div className="flex h-screen bg-surface-main font-inter overflow-hidden">
      
      {/* ═══ SIDEBAR ═══ */}
      <aside className={`${isSidebarOpen ? "w-64" : "w-20"} bg-white/90 backdrop-blur-xl border-r border-blue-20 shadow-[4px_0_24px_rgba(1,12,29,0.02)] flex flex-col z-50 transition-all duration-300 hidden md:flex flex-shrink-0`}>
        <div className="h-20 flex items-center justify-center border-b border-blue-10 overflow-hidden px-4">
          <Link to="/" className="flex items-center gap-3 group">
            <img src={logo} alt="Ticket Vibez" className="h-10 w-10 min-w-[40px] object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform" />
            {isSidebarOpen && (
              <span className="font-outfit font-bold tracking-tight text-lg text-heading whitespace-nowrap animate-fade-in">
                Ticket <span className="bg-gradient-to-r from-blue-600 to-blue-400 text-transparent bg-clip-text">Vibez</span>
              </span>
            )}
          </Link>
        </div>

        <div className={`px-4 py-4 overflow-hidden ${!isSidebarOpen && "items-center flex flex-col"}`}>
          {isSidebarOpen ? (
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2 whitespace-nowrap">Administration</p>
          ) : (
            <div className="w-6 h-px bg-gray-200 mb-4"></div>
          )}
          <nav className="space-y-2 w-full">
            {sidebarLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => setActiveTab(link.name)}
                title={!isSidebarOpen ? link.name : ""}
                className={`w-full flex items-center ${isSidebarOpen ? "gap-3 px-4" : "justify-center px-0"} py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === link.name
                    ? "bg-primary text-white shadow-glow"
                    : "text-gray-600 hover:bg-blue-5 hover:text-primary"
                }`}
              >
                <span className={`text-[18px] ${activeTab === link.name ? "text-white" : "text-gray-400"}`}>{link.icon}</span>
                {isSidebarOpen && <span className="whitespace-nowrap">{link.name}</span>}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 border-t border-blue-10 overflow-hidden">
          <button
            onClick={handleLogout}
            title={!isSidebarOpen ? "Log Out" : ""}
            className={`w-full flex items-center ${isSidebarOpen ? "gap-3 px-4" : "justify-center px-0"} py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors`}
          >
            <FaSignOutAlt size={18} />
            {isSidebarOpen && <span className="whitespace-nowrap">Log Out</span>}
          </button>
        </div>
      </aside>

      {/* ═══ MAIN CONTENT AREA ═══ */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* ═══ TOPBAR ═══ */}
        <header className="h-20 flex-shrink-0 bg-white/70 backdrop-blur-md border-b border-blue-20 flex items-center justify-between px-4 sm:px-8 z-40 relative">
          <div className="flex items-center gap-4">
            <button className="md:hidden text-gray-500 hover:text-primary p-2 transition-colors">
              <FaBars size={20} />
            </button>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:block text-gray-500 hover:text-primary p-2 transition-colors"
            >
              <FaBars size={20} />
            </button>
            <div className="hidden sm:flex relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              <input 
                type="text" 
                placeholder="Search events, users..." 
                className="w-72 bg-white border border-blue-20 rounded-full py-2.5 pl-10 pr-4 text-sm text-heading placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-gray-400 hover:text-primary transition-colors">
              <FaBell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-blue-20"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-heading leading-tight group-hover:text-primary transition-colors">{user?.name || "System Admin"}</p>
                <p className="text-xs text-muted">{user?.email || "admin@ticketvibez.com"}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
                {user?.name?.[0] || "A"}
              </div>
            </div>
          </div>
        </header>

        {/* ═══ DASHBOARD CONTENT ═══ */}
        <main className="flex-1 overflow-auto p-4 sm:p-8">
          
          <div className="flex items-end justify-between mb-8 animate-fade-in-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-outfit font-bold text-heading">{activeTab}</h1>
              <p className="text-muted text-sm mt-1">
                {activeTab === "Dashboard" && "Monitor your platform's holistic performance."}
                {activeTab === "Events Approvals" && "Review and moderate pending event requests."}
                {activeTab === "Ticket Management" && "Monitor and confirm manual payment requests."}
                {activeTab === "User Management" && "Manage platform users and roles."}
              </p>
            </div>
          </div>

          {activeTab === "Dashboard" && (
            <div className="space-y-8 animate-fade-in">
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
                <div className="bg-white rounded-2xl p-6 shadow-card border border-blue-20 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-5 text-primary flex items-center justify-center text-xl group-hover:bg-primary group-hover:text-white transition-all">
                      <FaCalendarAlt />
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Total Events</p>
                  <p className="text-3xl font-outfit font-bold text-heading mt-1">{dashboardData.totalEvents}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-card border border-blue-20 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-xl group-hover:bg-orange-500 group-hover:text-white transition-all">
                      <FaChartLine />
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Pending Approvals</p>
                  <p className="text-3xl font-outfit font-bold text-heading mt-1">{dashboardData.pendingApprovals}</p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-card border border-blue-20 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center text-xl group-hover:bg-violet-500 group-hover:text-white transition-all">
                      <FaTicketAlt />
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Confirmed Tickets</p>
                  <p className="text-3xl font-outfit font-bold text-heading mt-1">{dashboardData.ticketsSold.toLocaleString()}</p>
                  <p className="text-xs text-orange-500 mt-2 font-medium">
                    {tickets.filter(t => t.status === 'pending').length} pending approval
                  </p>
                </div>

                <div className="bg-white rounded-2xl p-6 shadow-card border border-blue-20 group">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-500 flex items-center justify-center text-xl group-hover:bg-emerald-500 group-hover:text-white transition-all">
                      <FaMoneyBillWave />
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-outfit font-bold text-heading mt-1">${dashboardData.totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-card border border-blue-20">
                  <h2 className="font-outfit font-bold text-lg text-heading mb-6">Revenue Growth</h2>
                  <div className="h-64"><Line data={revenueData} options={chartOptions} /></div>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-card border border-blue-20">
                  <h2 className="font-outfit font-bold text-lg text-heading mb-6">Ticket Distribution</h2>
                  <div className="h-64"><Bar data={ticketsData} options={chartOptions} /></div>
                </div>
              </div>
            </div>
          )}

          {/* Organizer Approvals Tab removed */}

          {activeTab === "Ticket Management" && (
            <div className="animate-fade-in shadow-card rounded-2xl border border-blue-20 bg-white overflow-hidden">
                <div className="p-6 border-b border-blue-10 flex justify-between items-center bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <h2 className="font-outfit font-bold text-lg text-heading">Global Ticket Status</h2>
                    {loadingTickets && <span className="animate-spin text-primary"><FaChartLine size={14} /></span>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs font-medium bg-blue-100 text-primary-dark px-3 py-1 rounded-full">
                      {tickets.filter(t => t.status === 'pending').length} Pending Payments
                    </span>
                    <button 
                      onClick={fetchTickets}
                      className="text-xs text-primary hover:underline font-semibold"
                    >
                      Refresh
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white border-b border-blue-10">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Ticket Details</th>
                        <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Customer</th>
                        <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Amount</th>
                        <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-5">
                      {tickets.length > 0 ? (
                        tickets.map((ticket) => (
                        <tr key={ticket.id} className="hover:bg-blue-5/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-heading">{ticket.event_title}</div>
                            <div className="text-xs text-muted mt-0.5">{ticket.ticket_type_name} × {ticket.quantity}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-700">{ticket.user_name}</div>
                            <div className="text-xs text-muted mt-0.5">{ticket.user_email}</div>
                          </td>
                          <td className="px-6 py-4 font-bold text-gray-900">
                            KES {ticket.total_amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                              ${ticket.status === 'confirmed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                ticket.status === 'cancelled' ? 'bg-red-50 text-red-600 border border-red-100' : 
                                'bg-orange-50 text-orange-600 border border-orange-100'}
                            `}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                ticket.status === 'confirmed' ? 'bg-emerald-500' : 
                                ticket.status === 'cancelled' ? 'bg-red-500' : 
                                'bg-orange-500'
                              }`}></span>
                              {ticket.status ? ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {ticket.status === 'pending' && (
                              <button 
                                onClick={() => handleConfirmTicket(ticket.id)}
                                className="px-4 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 text-xs font-bold transition-all border border-emerald-200"
                              >
                                Confirm Payment
                              </button>
                            )}
                          </td>
                        </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-muted italic">
                            No tickets found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
          )}

          {activeTab === "Events Approvals" && (
            <div className="animate-fade-in shadow-card rounded-2xl border border-blue-20 bg-white overflow-hidden">
               <div className="p-6 border-b border-blue-10 flex justify-between items-center bg-gray-50/50">
                  <h2 className="font-outfit font-bold text-lg text-heading">Event Approval Queue</h2>
                  <span className="text-xs font-medium bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
                    {events.filter(e => e.status === 'pending').length} Pending Requests
                  </span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white border-b border-blue-10">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Event Details</th>
                        <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Date & Location</th>
                        <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                        <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-5">
                      {events.length > 0 ? (
                        events.map((event) => (
                        <tr key={event.id} className="hover:bg-blue-5/30 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-heading">{event.title}</div>
                            <div className="text-xs text-muted mt-0.5">ID: #EVT-{event.id}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-gray-700">{event.event_date}</div>
                            <div className="text-xs text-muted mt-0.5">{event.location}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
                              ${event.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                                event.status === 'rejected' ? 'bg-red-50 text-red-600 border border-red-100' : 
                                'bg-orange-50 text-orange-600 border border-orange-100'}
                            `}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                event.status === 'approved' ? 'bg-emerald-500' : 
                                event.status === 'rejected' ? 'bg-red-500' : 
                                'bg-orange-500'
                              }`}></span>
                              {event.status ? event.status.charAt(0).toUpperCase() + event.status.slice(1) : 'Pending'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right space-x-2">
                            {event.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleStatusUpdate(event.id, 'approve')}
                                  className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors shadow-sm" 
                                  title="Approve"
                                >
                                  <FaCheckCircle size={16} />
                                </button>
                                <button 
                                  onClick={() => handleStatusUpdate(event.id, 'reject')}
                                  className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 transition-colors shadow-sm" 
                                  title="Reject"
                                >
                                  <FaStopCircle size={16} />
                                </button>
                              </>
                            )}
                            {event.status !== 'pending' && (
                              <span className="text-xs text-muted italic mr-4">Resolved</span>
                            )}
                          </td>
                        </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="px-6 py-12 text-center text-muted italic">
                            No events found in the database.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
          )}

          {activeTab === "User Management" && (
            <div className="animate-fade-in bg-white rounded-2xl shadow-card border border-blue-20 overflow-hidden">
                <div className="p-6 border-b border-blue-10 flex justify-between items-center bg-gray-50/50">
                  <h2 className="font-outfit font-bold text-lg text-heading">System Users</h2>
                  <span className="text-xs font-medium bg-blue-100 text-primary-dark px-2.5 py-1 rounded-full">{users.length} Total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-white border-b border-blue-10">
                      <tr>
                        <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">User Name</th>
                        <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Email</th>
                        <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-5">
                      {users.length > 0 ? users.map(u => (
                        <tr key={u.id} className="hover:bg-blue-5/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-heading">{u.name}</td>
                          <td className="px-6 py-4 text-gray-600">{u.email}</td>
                          <td className="px-6 py-4 capitalize font-medium">{u.role}</td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="3" className="px-6 py-12 text-center text-muted italic">No users found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
            </div>
          )}

          {activeTab === "Global Settings" && (
            <div className="animate-fade-in p-12 text-center bg-white rounded-2xl border border-blue-20 shadow-card">
              <FaUserShield className="mx-auto text-4xl text-blue-200 mb-4" />
              <h2 className="text-xl font-bold text-heading">Global Settings</h2>
              <p className="text-muted mt-2">Configuration options for platform-wide policies.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
