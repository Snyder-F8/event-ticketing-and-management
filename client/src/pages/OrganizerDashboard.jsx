// src/pages/OrganizerDashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import {
  FaCalendarAlt,
  FaThLarge,
  FaSignOutAlt,
  FaPlus,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Line, Bar } from "react-chartjs-2";
import "chart.js/auto";
import API from "../services/api";

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
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    capacity: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get("/api/events/my-events");
        const fetchedEvents = res.data.events || [];

        setEvents(fetchedEvents);

        const totalEvents = fetchedEvents.length;
        const totalCapacity = fetchedEvents.reduce(
          (acc, curr) => acc + (Number(curr.capacity) || 0),
          0
        );

        setMetrics([
          { title: "Total Events", value: totalEvents.toString() },
          { title: "Total Capacity", value: totalCapacity.toString() },
          { title: "Revenue", value: "KES 0" },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleCreateEvent = async (e) => {
    e.preventDefault();

    try {
      if (!newEvent.title || !newEvent.date || !newEvent.time) return;

      const payload = {
        title: newEvent.title,
        description: newEvent.description,
        location: newEvent.location,
        capacity: Number(newEvent.capacity),
        event_date: `${newEvent.date}T${newEvent.time}:00`,
      };

      const res = await API.post("/api/events", payload);

      setEvents((prev) => [res.data.event, ...prev]);
      setShowModal(false);

      setNewEvent({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        capacity: "",
      });
    } catch (err) {
      console.error(err);
      alert("Failed to create event");
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
        data: [10000, 20000, 15000, 30000, 25000],
      },
    ],
  };

  const ticketsData = {
    labels: ["VIP", "Regular", "Student"],
    datasets: [
      {
        label: "Tickets",
        data: [50, 200, 100],
      },
    ],
  };

  return (
    <div className="flex h-screen bg-gray-100">

      {/* SIDEBAR */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 font-bold text-xl">Ticket Vibez</div>

        <nav className="flex-1 space-y-2 px-4">
          <button className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded">
            <FaThLarge /> Dashboard
          </button>
          <button className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded">
            <FaCalendarAlt /> My Events
          </button>
          <button className="flex items-center gap-2 p-3 hover:bg-gray-100 rounded">
            <FaUsers /> Attendees
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="p-4 flex items-center gap-2 text-red-500 hover:bg-red-50"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* MAIN */}
      <main className="flex-1 p-6 overflow-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Organizer Dashboard</h1>

          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <FaPlus /> Create Event
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {metrics.map((m) => (
            <div key={m.title} className="bg-white p-4 rounded shadow">
              <p className="text-gray-500">{m.title}</p>
              <p className="text-xl font-bold">{m.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <Line data={revenueData} />
          </div>
          <div className="bg-white p-4 rounded shadow">
            <Bar data={ticketsData} />
          </div>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-4">My Events</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th>Name</th>
                <th>Date</th>
                <th>Location</th>
                <th>Capacity</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event) => (
                <tr key={event.id || event._id} className="border-b">
                  <td>{event.title}</td>
                  <td>{event.event_date}</td>
                  <td className="flex items-center gap-1">
                    <FaMapMarkerAlt /> {event.location}
                  </td>
                  <td>{event.capacity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="font-bold mb-4">Create Event</h2>

            <form onSubmit={handleCreateEvent} className="space-y-3">
              <input
                type="text"
                placeholder="Title"
                className="w-full border p-2"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                required
              />

              <input
                type="date"
                className="w-full border p-2"
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
                required
              />

              <input
                type="time"
                className="w-full border p-2"
                onChange={(e) =>
                  setNewEvent({ ...newEvent, time: e.target.value })
                }
                required
              />

              <input
                type="text"
                placeholder="Location"
                className="w-full border p-2"
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
                required
              />

              <input
                type="number"
                placeholder="Capacity"
                className="w-full border p-2"
                onChange={(e) =>
                  setNewEvent({ ...newEvent, capacity: e.target.value })
                }
                required
              />

              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 px-3 py-1 rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-1 rounded"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}