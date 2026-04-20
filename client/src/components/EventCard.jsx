// src/components/EventCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt, FaCalendarAlt } from "react-icons/fa";
import { getEventImage } from "../utils/imageHelper";

function getLowestPrice(ticketTypes) {
  if (!ticketTypes || ticketTypes.length === 0) return null;
  return Math.min(...ticketTypes.map((t) => t.price));
}

export default function EventCard({ event, index = 0, featured = false }) {
  const image = getEventImage(event.images?.[0]?.image_url);
  const lowestPrice = getLowestPrice(event.ticket_types);
  const category = event.categories?.[0] || "Event";

  return (
    <Link
      to={`/events/${event.id}`}
      id={`event-card-${event.id}`}
      className={`group block rounded-2xl overflow-hidden bg-white border border-blue-20 shadow-card
        hover:shadow-card-hover hover:border-primary-lighter transition-all duration-500 hover:-translate-y-1
        ${featured ? "min-w-[310px] md:min-w-[340px]" : ""}`}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-primary text-white">
          {category}
        </span>
        {lowestPrice !== null && (
          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-blue-950 backdrop-blur-sm">
            {lowestPrice === 0 ? "Free" : `From KES ${lowestPrice.toLocaleString()}`}
          </span>
        )}
      </div>

      <div className="p-5">
        <h3 className="font-outfit font-bold text-lg text-heading mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {event.title}
        </h3>
        {event.description && (
          <p className="text-sm text-muted mb-3 line-clamp-2">{event.description}</p>
        )}
        <div className="flex flex-col gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <FaCalendarAlt className="text-primary text-xs flex-shrink-0" />
            <span className="truncate">{event.event_date || "TBA"}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-primary-dark text-xs flex-shrink-0" />
            <span className="truncate">{event.location || "TBA"}</span>
          </div>
        </div>
        <div className="mt-4 pt-3 border-t border-blue-10 flex items-center justify-between">
          {event.ticket_types?.length > 0 ? (
            <span className="text-xs text-muted">
              {event.ticket_types.reduce((sum, t) => sum + (t.tickets_remaining || 0), 0)} tickets left
            </span>
          ) : (
            <span className="text-xs text-muted">Tickets available</span>
          )}
          <span className="text-xs font-semibold text-primary group-hover:text-primary-dark transition-colors">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
}
