// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  FaHome,
  FaCalendarAlt,
  FaUserShield,
  FaSignOutAlt,
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import logo from "../assets/logo.png";
import API from "../services/api";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // Sidebar links
  const sidebarLinks = [
    { name: "Home", icon: <FaHome /> },
    { name: "Events", icon: <FaCalendarAlt /> },
    { name: "Admin", icon: <FaUserShield /> },
  ];

  // Metrics (static for now)
  const metrics = [
    { title: "Total Events", value: 24 },
    { title: "Pending Approvals", value: 5 },
    { title: "Tickets Sold", value: 1200 },
    { title: "Total Users", value: users.length || 0 },
  ];

  // Events (mock data for now)
  const eventsData = [
    {
      event: "Tech Conference",
      date: "2026-04-10",
      location: "Nairobi",
      status: "Pending",
    },
    {
      event: "Music Fest",
      date: "2026-05-01",
      location: "Mombasa",
      status: "Approved",
    },
    {
      event: "Art Expo",
      date: "2026-04-20",
      location: "Nakuru",
      status: "Pending",
    },
  ];

  // Charts
  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenue ($)",
        data: [1200, 1900, 3000, 5000, 4000],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgba(59, 130, 246, 1)",
        borderWidth: 2,
      },
    ],
  };

  const ticketsData = {
    labels: ["Tech", "Music", "Art", "Sports", "Education"],
    datasets: [
      {
        label: "Tickets Sold",
        data: [200, 400, 150, 300, 150],
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#8b5cf6",
        ],
      },
    ],
  };

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingUsers(true);
        const res = await API.get("/users");

        // supports either {users: []} or direct array
        setUsers(res.data.users || res.data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside className="bg-gradient-to-b from-blue-900 to-blue-800 text-white w-64 flex flex-col shadow-xl">

        {/* Logo */}
        <div className="p-6 flex items-center space-x-3">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-12 object-contain rounded-full"
          />
          <span className="text-lg font-bold">Ticket Vibez</span>
        </div>

        {/* Nav */}
        <nav className="flex-1">
          {sidebarLinks.map((link) => (
            <div
              key={link.name}
              className="flex items-center p-4 hover:bg-blue-700/80 rounded-lg mx-2 cursor-pointer transition-all"
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 flex items-center hover:bg-blue-700/80 rounded-lg mx-2 cursor-pointer">
          <FaSignOutAlt className="mr-3" />
          Logout
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">

        {/* Topbar */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
          <h1 className="text-2xl font-bold text-gray-800">
            Admin Dashboard
          </h1>

          <div className="flex items-center space-x-3">
            <img
              src={logo}
              alt="Admin"
              className="h-12 w-12 rounded-full border"
            />
            <span className="font-semibold text-gray-700">Admin</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          {metrics.map((metric) => (
            <div
              key={metric.title}
              className="bg-white rounded-xl shadow-sm p-5 border"
            >
              <p className="text-gray-500">{metric.title}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h2 className="font-bold mb-2">Revenue Overview</h2>
            <Line data={revenueData} />
          </div>

          <div className="bg-white rounded-xl shadow-sm p-5 border">
            <h2 className="font-bold mb-2">Tickets Sold</h2>
            <Bar data={ticketsData} />
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl shadow-sm p-5 border">
          <h2 className="font-bold mb-4">Event Approval Queue</h2>

          <table className="min-w-full text-sm text-gray-600">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="p-2">Event</th>
                <th className="p-2">Date</th>
                <th className="p-2">Location</th>
                <th className="p-2">Status</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {eventsData.map((event) => (
                <tr key={event.event} className="border-b hover:bg-gray-50">
                  <td className="p-2">{event.event}</td>
                  <td className="p-2">{event.date}</td>
                  <td className="p-2">{event.location}</td>
                  <td className="p-2">{event.status}</td>
                  <td className="p-2 space-x-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                      Approve
                    </button>
                    <button className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm p-5 border mt-6">
          <h2 className="font-bold mb-4">Users</h2>

          {loadingUsers ? (
            <p>Loading users...</p>
          ) : (
            <table className="min-w-full text-sm text-gray-600">
              <thead className="border-b text-gray-500">
                <tr>
                  <th className="p-2">Name</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Role</th>
                </tr>
              </thead>

              <tbody>
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <tr
                      key={user._id || user.id || index}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-2">{user.name}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2 capitalize">{user.role}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-2 text-center">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </main>
    </div>
  );
}