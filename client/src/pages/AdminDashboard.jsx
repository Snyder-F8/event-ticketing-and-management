import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";

import {
  FaHome,
  FaCalendarAlt,
  FaUserShield,
  FaSignOutAlt,
  FaUsers,
  FaCheckCircle,
  FaStopCircle,
  FaChartLine,
  FaTicketAlt,
  FaMoneyBillWave,
} from "react-icons/fa";

import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import { Chart } from "chart.js";

import logo from "../assets/logo.png";
import API from "../services/api";

Chart.defaults.font.family = "Outfit, sans-serif";
Chart.defaults.color = "#6B7280";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [activeTab, setActiveTab] = useState("Dashboard");

  const [dashboardData, setDashboardData] = useState({
    totalEvents: 0,
    pendingApprovals: 0,
    ticketsSold: 1200,
    totalRevenue: 45000,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await API.get("/auth/users");
        setUsers(res.data.users || []);
        setDashboardData((prev) => ({
          ...prev,
          totalUsers: res.data.total || 0,
        }));
      } catch (err) {
        console.error(err);
      }
    };

    const fetchEvents = async () => {
      try {
        const res = await API.get("/api/events/all");
        const data = res.data.events || [];

        setEvents(data);

        const pending = data.filter((e) => e.status === "pending").length;

        setDashboardData((prev) => ({
          ...prev,
          totalEvents: data.length,
          pendingApprovals: pending,
        }));
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
    fetchEvents();
  }, []);

  const handleStatusUpdate = async (id, action) => {
    try {
      const res = await API.patch(`/api/events/${id}/approve`, { action });

      setEvents((prev) =>
        prev.map((e) => (e.id === id || e._id === id ? res.data.event : e))
      );

      setDashboardData((prev) => ({
        ...prev,
        pendingApprovals: Math.max(prev.pendingApprovals - 1, 0),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenue",
        data: [12000, 19000, 15000, 30000, 25000],
        borderColor: "#4C8CF7",
        backgroundColor: "rgba(76,140,247,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const ticketsData = {
    labels: ["Music", "Tech", "Sports", "Art"],
    datasets: [
      {
        label: "Tickets",
        data: [450, 300, 150, 200],
        backgroundColor: ["#4C8CF7", "#10b981", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const sidebarLinks = [
    { name: "Dashboard", icon: <FaHome /> },
    { name: "Events", icon: <FaCalendarAlt /> },
    { name: "Users", icon: <FaUsers /> },
    { name: "Settings", icon: <FaUserShield /> },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-5 flex items-center gap-3">
          <img src={logo} alt="logo" className="h-10 w-10 rounded-full" />
          <span className="font-bold">Ticket Vibez</span>
        </div>

        <nav className="flex-1">
          {sidebarLinks.map((link) => (
            <div
              key={link.name}
              onClick={() => setActiveTab(link.name)}
              className="p-4 hover:bg-blue-700 cursor-pointer flex gap-2"
            >
              {link.icon} {link.name}
            </div>
          ))}
        </nav>

        <div
          onClick={handleLogout}
          className="p-4 hover:bg-red-600 cursor-pointer flex gap-2"
        >
          <FaSignOutAlt /> Logout
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">{activeTab}</h1>

        {activeTab === "Dashboard" && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <Card title="Events" value={dashboardData.totalEvents} />
              <Card title="Pending" value={dashboardData.pendingApprovals} />
              <Card title="Tickets" value={dashboardData.ticketsSold} />
              <Card title="Revenue" value={dashboardData.totalRevenue} />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded shadow">
                <Line data={revenueData} />
              </div>
              <div className="bg-white p-4 rounded shadow">
                <Bar data={ticketsData} />
              </div>
            </div>
          </>
        )}

        {activeTab === "Events" && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-4">Event Approvals</h2>

            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {events.map((e) => (
                  <tr key={e.id || e._id}>
                    <td>{e.title}</td>
                    <td>{e.status}</td>
                    <td>
                      {e.status === "pending" && (
                        <>
                          <button onClick={() => handleStatusUpdate(e.id || e._id, "approve")}>
                            ✔
                          </button>
                          <button onClick={() => handleStatusUpdate(e.id || e._id, "reject")}>
                            ✖
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "Users" && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-4">Users</h2>

            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>

              <tbody>
                {users.map((u) => (
                  <tr key={u.id || u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td>{u.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-xl font-bold">{value}</h2>
    </div>
  );
}