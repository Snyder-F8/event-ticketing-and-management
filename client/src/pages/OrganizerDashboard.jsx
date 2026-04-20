// src/pages/OrganizerDashboard.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import {
  FaHome,
  FaCalendarAlt,
  FaThLarge,
  FaSignOutAlt,
  FaSearch,
  FaBell,
  FaBars,
  FaPlus,
  FaMoneyCheckAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaTimes,
  FaTrash,
  FaImage,
  FaLink,
  FaUpload
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Chart } from "chart.js";
import logo from "../assets/logo.png";
import API from "../services/api";

Chart.defaults.font.family = "Outfit, sans-serif";
Chart.defaults.color = "#6B7280";
Chart.defaults.scale.grid.color = "rgba(76, 140, 247, 0.05)";

export default function OrganizerDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [metrics, setMetrics] = useState([
    { title: "Total Events", value: "0" },
    { title: "Total Capacity", value: "0" },
    { title: "Revenue", value: "KES 0" },
  ]);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ 
    title: "", category: "", description: "", date: "", time: "", capacity: "", location: "", image_url: "" 
  });
  const [ticketTypes, setTicketTypes] = useState([
    { name: "General", price: "1000", capacity: "100" }
  ]);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    total_revenue: 0,
    total_tickets_sold: 0,
    events_count: 0,
    sales_by_type: [],
    revenue_by_month: []
  });

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  // Image states
  const [imageType, setImageType] = useState('url'); // 'url' or 'upload'
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsRes, statsRes] = await Promise.all([
          API.get("/api/events/my-events"),
          API.get("/api/tickets/organizer-stats")
        ]);

        const fetchedEvents = eventsRes.data.events || [];
        const fetchedStats = statsRes.data || {};
        
        setEvents(fetchedEvents);
        setStats(fetchedStats);
        
        setMetrics([
          { title: "Total Events", value: fetchedStats.events_count?.toString() || "0" },
          { title: "Total Sold", value: fetchedStats.total_tickets_sold?.toLocaleString() || "0" },
          { title: "Revenue", value: `KES ${fetchedStats.total_revenue?.toLocaleString() || "0"}` },
        ]);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    };
    fetchData();
  }, []);

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setNewEvent({ ...newEvent, image_url: "" });
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
    setNewEvent({ ...newEvent, image_url: "" });
  };

  const handleEditClick = (event) => {
    setIsEditing(true);
    setEditingId(event.id);
    
    // Parse raw_date (ISO) into date and time
    let dateStr = "";
    let timeStr = "";
    if (event.raw_date) {
      const dt = new Date(event.raw_date);
      dateStr = dt.toISOString().split("T")[0];
      timeStr = dt.toTimeString().split(" ")[0].slice(0, 5); // HH:mm
    }

    setNewEvent({
      title: event.title,
      category: event.categories?.[0] || "",
      description: event.description,
      date: dateStr,
      time: timeStr,
      capacity: event.capacity || "",
      location: event.location,
      image_url: event.images?.[0]?.image_url || ""
    });
    setTicketTypes(event.ticket_types || [{ name: "General", price: "1000", capacity: "100" }]);
    setImagePreview(event.images?.[0]?.image_url || "");
    setShowModal(true);
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      let finalImageUrl = newEvent.image_url;

      if (imageType === "upload" && imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await API.post("/api/events/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        finalImageUrl = uploadRes.data.url;
      }

      const eventPayload = {
        title: newEvent.title,
        description: newEvent.description,
        location: newEvent.location,
        event_date: newEvent.date && newEvent.time ? `${newEvent.date}T${newEvent.time}:00` : undefined,
        image_url: finalImageUrl,
        categories: newEvent.category ? [newEvent.category] : [],
        ticket_types: ticketTypes.map(tt => ({
          name: tt.name,
          price: Number(tt.price) || 0,
          quantity: Number(tt.capacity) || 1
        }))
      };

      if (isEditing) {
        const res = await API.put(`/api/events/${editingId}`, eventPayload);
        setEvents((prev) => prev.map(ev => ev.id === editingId ? res.data.event : ev));
      } else {
        const res = await API.post("/api/events", eventPayload);
        setEvents((prev) => [res.data.event, ...prev]);
      }

      setShowModal(false);
      setIsEditing(false);
      setEditingId(null);
      setNewEvent({ title: "", category: "", description: "", date: "", time: "", capacity: "", location: "", image_url: "" });
      setTicketTypes([{ name: "General", price: "1000", capacity: "100" }]);
      clearImage();
    } catch (err) {
      console.error("Event operation error:", err.response?.data || err);
      alert(err.response?.data?.errors ? JSON.stringify(err.response.data.errors) : "Operation failed. Please try again.");
    }
  };

  const revenueData = {
    labels: stats.revenue_by_month.length > 0 ? stats.revenue_by_month.map(m => m.month) : ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      { 
        label: "Revenue (KES)", 
        data: stats.revenue_by_month.length > 0 ? stats.revenue_by_month.map(m => m.revenue) : [0, 0, 0, 0, 0], 
        backgroundColor: "rgba(16, 185, 129, 0.1)", 
        borderColor: "#10b981", 
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#fff",
        pointBorderColor: "#10b981",
        pointBorderWidth: 2,
        pointRadius: 4,
      }
    ]
  };

  const ticketsData = {
    labels: stats.sales_by_type.length > 0 ? stats.sales_by_type.map(s => s.name) : ["None"],
    datasets: [
      { 
        label: "Tickets Sold", 
        data: stats.sales_by_type.length > 0 ? stats.sales_by_type.map(s => s.value) : [0], 
        backgroundColor: ["#f59e0b", "#4C8CF7", "#8b5cf6", "#10b981"],
        borderRadius: 6,
        barThickness: 32,
      }
    ]
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

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const sidebarLinks = [
    { name: "Dashboard", icon: <FaThLarge /> },
    { name: "My Events", icon: <FaCalendarAlt /> },
    { name: "Sales & Attendees", icon: <FaUsers /> },
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
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-2 whitespace-nowrap">Organizer Center</p>
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
                placeholder="Search my events..." 
                className="w-72 bg-white border border-blue-20 rounded-full py-2.5 pl-10 pr-4 text-sm text-heading placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-5">
            <button className="relative text-gray-400 hover:text-primary transition-colors">
              <FaBell size={20} />
            </button>
            <div className="h-8 w-px bg-blue-20"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-heading leading-tight group-hover:text-primary transition-colors">Partner Organizer</p>
                <p className="text-xs text-muted">events@partner.com</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-800 to-blue-600 flex items-center justify-center text-white font-bold shadow-md border-2 border-white">
                O
              </div>
            </div>
          </div>
        </header>

        {/* ═══ DASHBOARD CONTENT ═══ */}
        <main className="flex-1 overflow-auto p-4 sm:p-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 animate-fade-in-up">
            <div>
              <h1 className="text-2xl sm:text-3xl font-outfit font-bold text-heading">Organizer Dashboard</h1>
              <p className="text-muted text-sm mt-1">Manage your event portfolio and track sales.</p>
            </div>
            <button
              onClick={() => {
                setIsEditing(false);
                setNewEvent({ title: "", category: "", description: "", date: "", time: "", capacity: "", location: "", image_url: "" });
                setTicketTypes([{ name: "General", price: "1000", capacity: "100" }]);
                clearImage();
                setShowModal(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-semibold transition-all shadow-glow hover:-translate-y-0.5"
            >
              <FaPlus size={12} /> Create Event
            </button>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 stagger-children">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-blue-20 hover:shadow-card-hover transition-all duration-400 hover:-translate-y-1 group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <FaCalendarAlt />
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">{metrics[0]?.title || "Total Events"}</p>
              <p className="text-3xl font-outfit font-bold text-heading mt-1">{metrics[0]?.value || "12"}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card border border-blue-20 hover:shadow-card-hover transition-all duration-400 hover:-translate-y-1 group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-5 text-primary flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
                  <FaUsers />
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">{metrics[1]?.title || "Total Capacity"}</p>
              <p className="text-3xl font-outfit font-bold text-heading mt-1">{metrics[1]?.value || "4,500"}</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card border border-blue-20 hover:shadow-card-hover transition-all duration-400 hover:-translate-y-1 group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-violet-50 text-violet-500 flex items-center justify-center text-xl group-hover:scale-110 group-hover:bg-violet-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <FaMoneyCheckAlt />
                </div>
              </div>
              <p className="text-gray-500 text-sm font-medium">{metrics[2]?.title || "Revenue"}</p>
              <p className="text-3xl font-outfit font-bold text-heading mt-1 text-primary">{metrics[2]?.value || "KES 245K"}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-card border border-blue-20 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-outfit font-bold text-lg text-heading">Event Revenue</h2>
              </div>
              <div className="h-64">
                <Line data={revenueData} options={chartOptions} />
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-card border border-blue-20 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-outfit font-bold text-lg text-heading">Ticket Sales by Type</h2>
              </div>
              <div className="h-64">
                <Bar data={ticketsData} options={chartOptions} />
              </div>
            </div>
          </div>

          {/* Events Table Container */}
          <div className="bg-white rounded-2xl shadow-card border border-blue-20 overflow-hidden mb-8 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <div className="p-6 border-b border-blue-10 flex justify-between items-center bg-gray-50/50">
              <h2 className="font-outfit font-bold text-lg text-heading">My Events</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-white border-b border-blue-10">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Event</th>
                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Date</th>
                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Location</th>
                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Capacity</th>
                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs">Status</th>
                    <th className="px-6 py-4 font-semibold text-gray-500 uppercase tracking-wider text-xs text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-5">
                  {events.length > 0 ? events.map((event, idx) => (
                    <tr key={idx} className="hover:bg-blue-5/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-5 overflow-hidden flex-shrink-0 border border-blue-10">
                            {event.images?.[0]?.image_url ? (
                              <img src={event.images[0].image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-300"><FaImage /></div>
                            )}
                          </div>
                          <div className="font-semibold text-heading max-w-[200px] truncate">{event.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{event.event_date}</td>
                      <td className="px-6 py-4 text-gray-700 max-w-[150px] truncate">
                        {event.location}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-700">{event.capacity || "Unlimited"}</td>
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
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleEditClick(event)}
                          className="px-4 py-1.5 rounded-lg bg-white border border-blue-20 text-primary text-xs font-bold hover:bg-primary hover:text-white hover:border-primary transition-all"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="max-w-xs mx-auto">
                          <div className="w-16 h-16 mx-auto bg-blue-5 rounded-full flex items-center justify-center text-primary mb-4">
                            <FaCalendarAlt size={24} />
                          </div>
                          <p className="text-heading font-medium mb-1">No Events Found</p>
                          <p className="text-muted text-sm mb-4">You haven't created any events yet.</p>
                          <button
                            onClick={() => setShowModal(true)}
                            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-5 hover:bg-blue-10 border border-blue-20 text-primary text-sm font-medium transition-colors"
                          >
                            <FaPlus size={10} /> Create First Event
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </main>
      </div>

      {/* ═══ CREATE EVENT MODAL (APPLE BENTO DNA) ═══ */}
      {showModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity" onClick={() => setShowModal(false)} />
          <div className="relative bg-[#f5f5f7]/95 backdrop-blur-3xl rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.2)] w-full max-w-4xl max-h-[95vh] flex flex-col border border-white/60 animate-scale-in">
            
            <div className="flex-shrink-0 z-10 px-8 py-6 flex justify-between items-center bg-[#f5f5f7]/80 backdrop-blur-xl border-b border-gray-200/50 rounded-t-[32px]">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">{isEditing ? "Edit Event" : "Create Event"}</h2>
                <p className="text-sm font-medium text-gray-500 mt-0.5">{isEditing ? "Refine your event details." : "Design your next great experience."}</p>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                type="button"
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200/50 text-gray-500 hover:bg-gray-200 hover:text-gray-900 transition-all outline-none"
              >
                <FaTimes size={14} />
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 custom-scrollbar">
              <form onSubmit={handleCreateEvent} className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                
                {/* Box 1: The Details */}
                <div className="col-span-1 md:col-span-2 bg-white rounded-[24px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100/80 flex flex-col gap-5">
                  <h3 className="text-sm font-semibold text-gray-800 tracking-tight flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    Primary Details
                  </h3>
                  
                  <div>
                    <label className="block text-[12px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Event Title</label>
                    <input
                      type="text"
                      placeholder="e.g. World Wide Developer Conference"
                      className="w-full bg-[#f5f5f7] border border-transparent rounded-[14px] px-4 py-3 text-[15px] font-medium text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Category</label>
                    <input
                      type="text"
                      placeholder="e.g. Technology, Music"
                      className="w-full bg-[#f5f5f7] border border-transparent rounded-[14px] px-4 py-3 text-[15px] font-medium text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={newEvent.category}
                      onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}
                    />
                  </div>

                  <div className="flex-1 flex flex-col">
                    <label className="block text-[12px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Description</label>
                    <textarea
                      placeholder="What is this event about?"
                      className="w-full flex-1 min-h-[120px] bg-[#f5f5f7] border border-transparent rounded-[14px] px-4 py-3 text-[15px] font-medium text-gray-900 placeholder-gray-400 resize-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={newEvent.description}
                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    />
                  </div>
                </div>

                {/* Box 2: Logistics */}
                <div className="col-span-1 bg-white rounded-[24px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100/80 flex flex-col gap-5">
                  <h3 className="text-sm font-semibold text-gray-800 tracking-tight flex items-center gap-2">
                     <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                     Logistics
                  </h3>
                  
                  <div>
                    <label className="block text-[12px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      className="w-full bg-[#f5f5f7] border border-transparent rounded-[14px] px-4 py-3 text-[15px] font-medium text-gray-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Time</label>
                    <input
                      type="time"
                      className="w-full bg-[#f5f5f7] border border-transparent rounded-[14px] px-4 py-3 text-[15px] font-medium text-gray-700 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Overall Capacity</label>
                    <input
                      type="number"
                      placeholder="Max attendees"
                      className="w-full bg-[#f5f5f7] border border-transparent rounded-[14px] px-4 py-3 text-[15px] font-medium text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={newEvent.capacity}
                      onChange={(e) => setNewEvent({ ...newEvent, capacity: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[12px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Location</label>
                    <input
                      type="text"
                      placeholder="Venue name or link"
                      className="w-full bg-[#f5f5f7] border border-transparent rounded-[14px] px-4 py-3 text-[15px] font-medium text-gray-900 placeholder-gray-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                      value={newEvent.location}
                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                {/* Box 2.5: Image Upload / URL Bento */}
                <div className="col-span-1 md:col-span-3 bg-white rounded-[24px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100/80">
                  <h3 className="text-sm font-semibold text-gray-800 tracking-tight flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 rounded-full bg-pink-500"></span>
                    Event Media
                  </h3>
                  
                  <div className="flex gap-2 mb-4 p-1 bg-[#f5f5f7] rounded-xl w-fit">
                    <button type="button" onClick={() => setImageType('url')} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${imageType === 'url' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                      <span className="flex items-center gap-1.5"><FaLink /> Image URL</span>
                    </button>
                    <button type="button" onClick={() => setImageType('upload')} className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-all ${imageType === 'upload' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                      <span className="flex items-center gap-1.5"><FaUpload /> Upload File</span>
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                      {imageType === 'url' ? (
                        <div className="flex flex-col gap-2">
                          <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Direct Image Link</label>
                          <input 
                            type="url" 
                            placeholder="https://example.com/banner.jpg" 
                            className="w-full bg-[#f5f5f7] border border-transparent rounded-[14px] px-4 py-3 text-[15px] font-medium text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            value={newEvent.image_url}
                            onChange={(e) => {
                              setNewEvent({ ...newEvent, image_url: e.target.value });
                              setImagePreview(e.target.value);
                            }}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2 relative">
                          <label className="text-[12px] font-bold text-gray-400 uppercase tracking-wider">Device Upload</label>
                          <div className="w-full border-2 border-dashed border-gray-300 rounded-[14px] p-8 flex flex-col items-center justify-center bg-[#fcfcfd] hover:bg-[#f5f5f7] hover:border-blue-300 transition-all cursor-pointer relative">
                            <input 
                              type="file" 
                              accept="image/*"
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              onChange={handleImageFileChange}
                              required={imageType === 'upload' && !imageFile}
                            />
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center mb-3">
                              <FaUpload size={18} />
                            </div>
                            <p className="text-sm font-semibold text-gray-700 mb-1">Click or drag image to upload</p>
                            <p className="text-xs text-gray-500">Supports JPG, PNG, WEBP (Max 5MB)</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="w-full md:w-1/3 flex flex-col justify-end">
                      <div className="w-full aspect-video rounded-[14px] bg-[#f5f5f7] border border-gray-200 overflow-hidden flex items-center justify-center relative group">
                        {imagePreview ? (
                          <>
                            <img src={imagePreview} alt="Event Preview" className="w-full h-full object-cover" onError={(e) => e.target.style.display = 'none'} />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button type="button" onClick={clearImage} className="w-10 h-10 rounded-full bg-white text-red-500 flex items-center justify-center shadow-lg"><FaTrash size={14}/></button>
                            </div>
                          </>
                        ) : (
                          <div className="flex flex-col items-center text-gray-400">
                            <FaImage size={32} className="mb-2 opacity-50" />
                            <p className="text-xs font-semibold tracking-wide">PREVIEW</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Box 3: Ticket Tiers */}
                <div className="col-span-1 md:col-span-3 bg-white rounded-[24px] p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] border border-gray-100/80">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-sm font-semibold text-gray-800 tracking-tight flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      Ticket Tiers
                    </h3>
                    <button
                      type="button"
                      onClick={() => setTicketTypes([...ticketTypes, { name: "", price: "", capacity: "" }])}
                      className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-colors outline-none focus:ring-2 focus:ring-blue-500/50"
                    >
                      <FaPlus size={10} /> Add Tier
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {ticketTypes.map((ticket, index) => (
                      <div key={index} className="flex flex-col sm:flex-row gap-3 items-center group">
                        <div className="flex-1 w-full relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Type</span>
                          <input
                            type="text"
                            placeholder="e.g. VIP"
                            className="w-full bg-[#f5f5f7] border border-transparent rounded-[14px] pl-16 pr-4 py-3 text-[15px] font-medium text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            value={ticket.name}
                            onChange={(e) => {
                              const newTypes = [...ticketTypes];
                              newTypes[index].name = e.target.value;
                              setTicketTypes(newTypes);
                            }}
                            required
                          />
                        </div>
                        <div className="flex-1 w-full relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Price</span>
                          <input
                            type="number"
                            placeholder="0.00"
                            className="w-full bg-[#f5f5f7] border border-transparent rounded-[14px] pl-16 pr-4 py-3 text-[15px] font-medium text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            value={ticket.price}
                            onChange={(e) => {
                              const newTypes = [...ticketTypes];
                              newTypes[index].price = e.target.value;
                              setTicketTypes(newTypes);
                            }}
                            required
                          />
                        </div>
                        <div className="flex-1 w-full relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">Limit</span>
                          <input
                            type="number"
                            placeholder="Supply"
                            className="w-full bg-[#f5f5f7] border border-transparent rounded-[14px] pl-16 pr-4 py-3 text-[15px] font-medium text-gray-900 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            value={ticket.capacity}
                            onChange={(e) => {
                              const newTypes = [...ticketTypes];
                              newTypes[index].capacity = e.target.value;
                              setTicketTypes(newTypes);
                            }}
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            if(ticketTypes.length > 1) {
                              setTicketTypes(ticketTypes.filter((_, i) => i !== index));
                            }
                          }}
                          className={`p-3 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all outline-none focus:ring-2 focus:ring-red-500/50 ${ticketTypes.length === 1 ? 'opacity-30 cursor-not-allowed hidden' : ''}`}
                          disabled={ticketTypes.length === 1}
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Box 4: Actions */}
                <div className="col-span-1 md:col-span-3 pb-2 pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 rounded-[18px] bg-blue-600 hover:bg-blue-500 text-white text-[16px] font-semibold tracking-wide shadow-[0_4px_14px_rgba(37,99,235,0.39)] hover:shadow-[0_6px_20px_rgba(37,99,235,0.23)] hover:-translate-y-0.5 transition-all outline-none focus:ring-4 focus:ring-blue-500/20"
                  >
                    {isEditing ? "Save Changes" : "Publish Event"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}