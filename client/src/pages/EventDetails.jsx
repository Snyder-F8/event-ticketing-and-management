import React, { useState, useRef, useEffect } from "react";
import worship from "../assets/worship.jpg";

const event = {
  id: 3,
  title: "Kimbilio Worship",
  genre: "Cultural Event",
  rating: 8.6,
  votes: "84.1K",
  img: worship,
  languages: ["English", "Swahili"],
  location: ["Nairobi Convention Center"],
  date: "20-01-2026",
  time: "6:00 PM",
  capacity: 500,
  organizer: "Kimbilio Worship Team",
  description:
    "Join us for a spiritually uplifting worship gathering filled with powerful praise and worship sessions, inspiring sermons, and moments of prayer and reflection. Experience a vibrant atmosphere of music, faith, and unity as people come together to celebrate, connect, and grow spiritually. The event will also feature guest ministers, live choir performances, and opportunities for fellowship with the community.",
  age: "13+",
  tickets: [
    { type: "Early Bird", price: 1500, remaining: 45, color: "#0B62F3" },
    { type: "Regular", price: 2500, remaining: 120, color: "#28A745" },
    { type: "VIP", price: 5000, remaining: 60, color: "#C82333" },
  ],
};

const EventDetails = () => {
  const [quantities, setQuantities] = useState({});
  const [columnHeight, setColumnHeight] = useState(0);

  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const handleQuantityChange = (type, value) => {
    setQuantities((prev) => ({ ...prev, [type]: Math.max(0, value) }));
  };

  const total = event.tickets.reduce(
    (sum, t) => sum + (quantities[t.type] || 0) * t.price,
    0,
  );

  // Set same height for left and right columns
  useEffect(() => {
    const leftHeight = leftRef.current?.offsetHeight || 0;
    const rightHeight = rightRef.current?.offsetHeight || 0;
    setColumnHeight(Math.max(leftHeight, rightHeight));
  }, [quantities]);

  return (
    <>
      {/* HERO / POSTER */}
      <div className="relative text-white font-sans px-4 py-10 bg-black">
        <div
          className="w-full h-80 rounded-xl overflow-hidden shadow-lg"
          style={{
            backgroundImage: `url(${event.img})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
      </div>

      {/* DETAILS + TICKETS: TWO-COLUMN SECTION */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Event Details */}
          <div
            ref={leftRef}
            className="lg:col-span-2 flex flex-col gap-6 bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-sm"
            style={{ minHeight: columnHeight }}
          >
            <h1 className="text-2xl lg:text-4xl font-bold mb-4">
              {event.title}
            </h1>

            {/* Event Info in Two Columns */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <span className="bg-[#f5f6f8] px-3 py-1 rounded">
                📅 {event.date}
              </span>
              <span className="bg-[#f5f6f8] px-3 py-1 rounded">
                ⏰ {event.time}
              </span>
              <span className="bg-[#f5f6f8] px-3 py-1 rounded">
                📍 {event.location.join(", ")}
              </span>
              <span className="bg-[#f5f6f8] px-3 py-1 rounded">
                👥 {event.capacity} attendees
              </span>
            </div>

            <hr className="border-gray-300 my-4" />

            {/* About */}
            <div>
              <h2 className="text-xl font-bold mb-2">About</h2>
              <p className="text-gray-700 leading-relaxed">
                {event.description}
              </p>
            </div>

            <hr className="border-gray-300 my-4" />

            {/* Organized By */}
            <div>
              <h2 className="text-xl font-bold mb-2">Organized By</h2>
              <p className="text-gray-700 flex items-center gap-2">
                <span>👤</span> {event.organizer}
              </p>
            </div>
          </div>
          {/* RIGHT COLUMN: Ticket Selection */}
          <div
            ref={rightRef}
            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm text-sm"
            style={{ minHeight: columnHeight }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Select Tickets
            </h2>

            <div className="space-y-4">
              {event.tickets.map((t) => (
                <div
                  key={t.type}
                  className="border border-gray-200 rounded-2xl p-4 bg-white text-sm"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {t.type}
                      </h3>
                      <p className="text-gray-500">{t.remaining} remaining</p>
                    </div>
                    <p className="text-lg font-semibold text-[#6C63FF]">
                      KES {t.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      className="w-8 h-8 rounded-xl border border-gray-200 text-lg text-gray-500 hover:bg-gray-50 flex items-center justify-center"
                      onClick={() =>
                        handleQuantityChange(
                          t.type,
                          (quantities[t.type] || 0) - 1,
                        )
                      }
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-lg font-medium text-gray-700">
                      {quantities[t.type] || 0}
                    </span>
                    <button
                      className="w-8 h-8 rounded-xl border border-gray-200 text-lg text-gray-700 hover:bg-gray-50 flex items-center justify-center"
                      onClick={() =>
                        handleQuantityChange(
                          t.type,
                          (quantities[t.type] || 0) + 1,
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SUMMARY BELOW BOTH COLUMNS */}
        {total > 0 && (
          <div className="mt-6 rounded-2xl border border-gray-200 p-4 bg-[#fafafa] text-sm">
            {event.tickets.map((t) => {
              const qty = quantities[t.type] || 0;
              if (!qty) return null;
              return (
                <div
                  key={t.type}
                  className="flex justify-between text-gray-700 mb-2"
                >
                  <span>
                    {t.type} ({qty})
                  </span>
                  <span>KES {(t.price * qty).toLocaleString()}</span>
                </div>
              );
            })}

            <div className="border-t border-gray-200 my-3"></div>
            <div className="flex justify-between font-semibold text-gray-900">
              <span>Total</span>
              <span>KES {total.toLocaleString()}</span>
            </div>

            <button className="mt-4 w-full bg-[#6C63FF] hover:bg-[#5b54e6] text-white py-2 rounded-xl font-semibold transition">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default EventDetails;
