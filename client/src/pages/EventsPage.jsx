// src/pages/EventsPage.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { FaSearch, FaMapMarkerAlt, FaFilter, FaTimes, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import API from "../services/api";
import { filterStubEvents, stubCategories } from "../data/stubEvents";
import EventCard from "../components/EventCard";
import { EventGridSkeleton } from "../components/LoadingSkeleton";

const categoryOptions = ["All", ...stubCategories];

export default function EventsPage() {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "All");
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { fetchEvents(); }, [page, category]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", page);
      params.set("per_page", 9);
      if (search) params.set("search", search);
      if (location) params.set("location", location);
      if (category && category !== "All") params.set("category", category);

      const res = await API.get(`/api/events?${params.toString()}`);
      const apiEvents = res.data.events || [];
      if (apiEvents.length > 0) {
        setEvents(apiEvents);
        setPagination(res.data.pagination || {});
      } else {
        // Fallback to stub
        const stub = filterStubEvents({ search, location, category, page, perPage: 9 });
        setEvents(stub.events);
        setPagination(stub.pagination);
      }
    } catch {
      const stub = filterStubEvents({ search, location, category, page, perPage: 9 });
      setEvents(stub.events);
      setPagination(stub.pagination);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => { e.preventDefault(); setPage(1); fetchEvents(); };
  const handleCategoryChange = (cat) => { setCategory(cat); setPage(1); };
  const clearFilters = () => { setSearch(""); setLocation(""); setCategory("All"); setPage(1); };
  const hasActiveFilters = search || location || (category && category !== "All");

  return (
    <div className="min-h-screen bg-surface-main">
      {/* Header */}
      <section className="relative py-12 md:py-16 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 overflow-hidden" id="events-page-header">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDcpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2cpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="font-outfit font-bold text-3xl md:text-4xl text-white mb-2">Explore <span className="text-blue-100">Events</span></h1>
          <p className="text-blue-80 mb-8">Discover events that match your vibe</p>

          <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl" id="events-search-form">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-white/20 rounded-xl py-3 pl-11 pr-4 text-heading text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" id="events-search-input" />
            </div>
            <div className="relative hidden md:block">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-48 bg-white border border-white/20 rounded-xl py-3 pl-11 pr-4 text-heading text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" id="events-location-input" />
            </div>
            <button type="submit" className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-all shadow-lg" id="events-search-btn">Search</button>
            <button type="button" onClick={() => setShowFilters(!showFilters)} className="md:hidden px-3 py-3 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"><FaFilter /></button>
          </form>
          {showFilters && (
            <div className="md:hidden mt-3">
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white rounded-xl py-3 pl-11 pr-4 text-heading text-sm placeholder-gray-400 focus:outline-none transition-all" />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="flex gap-2 overflow-x-auto pb-6" id="category-pills" style={{ scrollbarWidth: "none" }}>
          {categoryOptions.map((cat) => (
            <button key={cat} onClick={() => handleCategoryChange(cat)}
              className={`flex-shrink-0 px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                category === cat ? "bg-primary text-white shadow-glow" : "bg-white border border-blue-20 text-gray-600 hover:text-primary hover:border-primary-lighter"
              }`}>{cat}</button>
          ))}
          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium bg-red-50 text-red-500 border border-red-200 hover:bg-red-100 transition-all flex items-center gap-1">
              <FaTimes size={10} /> Clear
            </button>
          )}
        </div>

        {!loading && (
          <p className="text-sm text-muted mb-6">
            {pagination.total_items || 0} event{pagination.total_items !== 1 ? "s" : ""} found
            {category !== "All" && <span> in <span className="text-primary font-medium">{category}</span></span>}
            {search && <span> for "<span className="text-primary font-medium">{search}</span>"</span>}
          </p>
        )}

        {loading ? (
          <EventGridSkeleton count={6} />
        ) : events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 stagger-children">
              {events.map((event, i) => (
                <div key={event.id} className="animate-fade-in-up"><EventCard event={event} index={i} /></div>
              ))}
            </div>
            {pagination.total_pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12" id="events-pagination">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!pagination.has_prev}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-20 text-sm text-gray-600 hover:text-primary hover:border-primary-lighter disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  <FaChevronLeft size={10} /> Previous
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(pagination.total_pages, 5) }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <button key={pageNum} onClick={() => setPage(pageNum)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${page === pageNum ? "bg-primary text-white shadow-glow" : "text-gray-600 hover:bg-blue-5"}`}>
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button onClick={() => setPage((p) => p + 1)} disabled={!pagination.has_next}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-20 text-sm text-gray-600 hover:text-primary hover:border-primary-lighter disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                  Next <FaChevronRight size={10} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto rounded-full bg-blue-5 border border-blue-20 flex items-center justify-center mb-4">
              <FaSearch className="text-2xl text-muted" />
            </div>
            <h3 className="text-lg font-outfit font-semibold text-heading mb-2">No Events Found</h3>
            <p className="text-sm text-muted mb-6">Try adjusting your filters or search terms</p>
            <button onClick={clearFilters} className="px-6 py-2.5 rounded-lg bg-blue-5 text-primary text-sm font-medium hover:bg-blue-10 transition-colors">Clear All Filters</button>
          </div>
        )}
      </section>
    </div>
  );
}
