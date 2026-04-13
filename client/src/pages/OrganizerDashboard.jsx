// src/pages/OrganizerDashboard.jsx
import { useEffect, useState } from "react";
import { FaHome, FaCalendarAlt, FaThLarge, FaSignOutAlt } from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import logo from "../assets/logo.png";
import API from "../services/api";

const sidebarLinks = [
  { name: "Home", icon: <FaHome /> },
  { name: "Events", icon: <FaCalendarAlt /> },
  { name: "Dashboard", icon: <FaThLarge /> },
];

const initialMetrics = [
  { title: "Total Events", value: 0 },
  { title: "Total Capacity", value: 0 },
  { title: "Revenue", value: "KES 0" },
];

export default function OrganizerDashboard() {
  const [metrics, setMetrics] = useState(initialMetrics);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    capacity: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/organizer/metrics");

      setMetrics(res.data.metrics || initialMetrics);
      setEvents(res.data.events || []);
    } catch (err) {
      console.error("Failed to fetch organizer data:", err);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/organizer/events", newEvent);

      setEvents((prev) => [...prev, res.data]);

      setShowModal(false);
      setNewEvent({
        name: "",
        date: "",
        location: "",
        capacity: "",
      });
    } catch (err) {
      console.error("Failed to create event:", err);
    }
  };

  const revenueData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        label: "Revenue (KES)",
        data: [1000, 2000, 1500, 3000, 2500],
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

  return (
    <div className="flex h-screen font-sans">
      {/* Sidebar */}
      <aside className="bg-blue-900 text-white w-64 flex flex-col">
        <div className="p-6 text-2xl font-bold">Ticket Vibez</div>

        <nav className="flex-1">
          {sidebarLinks.map((link) => (
            <div
              key={link.name}
              className="flex items-center p-4 hover:bg-blue-700 cursor-pointer transition"
            >
              <span className="mr-3">{link.icon}</span>
              {link.name}
            </div>
          ))}
        </nav>

        <div className="p-4 flex items-center hover:bg-blue-700 cursor-pointer transition">
          <FaSignOutAlt className="mr-3" />
          Logout
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        {/* Topbar */}
        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm">
          <div>
            <h1 className="text-2xl font-bold">Organizer Dashboard</h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage your events and track performance
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <img
              src={logo}
              alt="Logo"
              className="w-12 h-12 rounded-full object-contain"
            />
            <span className="text-gray-700 font-medium">Organizer</span>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {metrics.map((m) => (
            <div
              key={m.title}
              className="bg-white shadow rounded p-4 hover:shadow-lg transition"
            >
              <p className="text-gray-500">{m.title}</p>
              <p className="text-2xl font-bold">{m.value}</p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white shadow rounded p-4">
            <h2 className="font-bold mb-2">Revenue Overview</h2>
            <Line data={revenueData} />
          </div>

          <div className="bg-white shadow rounded p-4">
            <h2 className="font-bold mb-2">Tickets Sold</h2>
            <Bar data={ticketsData} />
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white shadow rounded p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-bold text-lg">My Events</h2>

            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Create Event
            </button>
          </div>

          <table className="min-w-full text-left text-sm text-gray-600">
            <thead className="border-b text-gray-500">
              <tr>
                <th className="p-2">Event</th>
                <th className="p-2">Date</th>
                <th className="p-2">Location</th>
                <th className="p-2">Status</th>
                <th className="p-2">Capacity</th>
              </tr>
            </thead>

            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td className="p-4 text-center" colSpan="5">
                    No events found
                  </td>
                </tr>
              ) : (
                events.map((event, index) => (
                  <tr
                    key={event.id || index}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-2">{event.name}</td>
                    <td className="p-2">{event.date}</td>
                    <td className="p-2">{event.location}</td>
                    <td className="p-2">{event.status || "Pending"}</td>
                    <td className="p-2">{event.capacity}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">Create Event</h2>

              <form onSubmit={handleCreateEvent} className="space-y-3">
                <input
                  type="text"
                  placeholder="Event Name"
                  className="w-full border rounded px-3 py-2"
                  value={newEvent.name}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, name: e.target.value })
                  }
                  required
                />

                <input
                  type="date"
                  className="w-full border rounded px-3 py-2"
                  value={newEvent.date}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, date: e.target.value })
                  }
                  required
                />

                <input
                  type="text"
                  placeholder="Location"
                  className="w-full border rounded px-3 py-2"
                  value={newEvent.location}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, location: e.target.value })
                  }
                  required
                />

                <input
                  type="number"
                  placeholder="Capacity"
                  className="w-full border rounded px-3 py-2"
                  value={newEvent.capacity}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, capacity: e.target.value })
                  }
                  required
                />

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Create
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}