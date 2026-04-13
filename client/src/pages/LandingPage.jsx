// src/pages/LandingPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import {
  FiMusic, FiMonitor, FiAward, FiFeather,
  FiCoffee, FiFilm, FiArrowRight,
  FiCalendar, FiTag, FiUsers, FiStar,
  FiChevronLeft, FiChevronRight
} from "react-icons/fi";
import API from "../services/api";
import { stubEvents } from "../data/stubEvents";
import EventCard from "../components/EventCard";
import { EventCardSkeleton } from "../components/LoadingSkeleton";
import heroImg from "../assets/hero.png";
import sherehe from "../assets/sherehe.jpg";
import pulse from "../assets/pulse.jpg";

const categories = [
  { name: "Music", icon: <FiMusic size={28} strokeWidth={1.5} />, color: "from-pink-500 to-rose-400" },
  { name: "Technology", icon: <FiMonitor size={28} strokeWidth={1.5} />, color: "from-blue-500 to-cyan-400" },
  { name: "Sports", icon: <FiAward size={28} strokeWidth={1.5} />, color: "from-green-500 to-emerald-400" },
  { name: "Art & Culture", icon: <FiFeather size={28} strokeWidth={1.5} />, color: "from-purple-500 to-violet-400" },
  { name: "Food & Drink", icon: <FiCoffee size={28} strokeWidth={1.5} />, color: "from-orange-500 to-amber-400" },
  { name: "Theatre", icon: <FiFilm size={28} strokeWidth={1.5} />, color: "from-red-500 to-pink-400" },
];

const stats = [
  { label: "Events Hosted", value: 500, suffix: "+", icon: <FiCalendar size={36} strokeWidth={1.5} /> },
  { label: "Tickets Sold", value: 15000, suffix: "+", icon: <FiTag size={36} strokeWidth={1.5} /> },
  { label: "Happy Attendees", value: 12000, suffix: "+", icon: <FiUsers size={36} strokeWidth={1.5} /> },
  { label: "Top Organizers", value: 120, suffix: "+", icon: <FiStar size={36} strokeWidth={1.5} /> },
];

const steps = [
  { step: "01", title: "Browse Events", desc: "Explore hundreds of events happening near you across all categories." },
  { step: "02", title: "Book Tickets", desc: "Choose your ticket type, select quantity, and pay securely with M-Pesa." },
  { step: "03", title: "Attend & Enjoy", desc: "Show your digital ticket at the venue and enjoy an unforgettable experience." },
];

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration, start]);
  return count;
}

function StatCard({ stat, inView }) {
  const count = useCountUp(stat.value, 2000, inView);
  return (
    <div className="text-center p-6">
      <div className="text-3xl text-primary mb-3 flex justify-center">{stat.icon}</div>
      <p className="text-3xl md:text-4xl font-outfit font-bold text-heading">
        {count.toLocaleString()}{stat.suffix}
      </p>
      <p className="text-sm text-muted mt-1">{stat.label}</p>
    </div>
  );
}

export default function LandingPage() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsInView, setStatsInView] = useState(false);
  const statsRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/api/events?per_page=8");
        const events = res.data.events || [];
        setFeaturedEvents(events.length > 0 ? events : stubEvents.slice(0, 8));
      } catch {
        setFeaturedEvents(stubEvents.slice(0, 8));
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setStatsInView(true); }, { threshold: 0.3 });
    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir === "left" ? -360 : 360, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      {/* ═══ HERO ═══ */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800" id="hero-section">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDcpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2cpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-60" />
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-primary/10 blur-[120px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-blue-100 text-sm font-medium">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live Events Near You
              </div>
              <h1 className="font-outfit font-extrabold text-4xl md:text-5xl lg:text-6xl leading-tight text-white">
                Discover <span className="text-blue-100">Amazing Events</span> & Book Instantly
              </h1>
              <p className="text-lg text-blue-80 max-w-lg leading-relaxed">
                From music festivals to tech conferences — find the perfect event, grab your tickets, and create memories that last a lifetime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <Link to="/events" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold bg-primary hover:bg-primary-hover transition-all shadow-lg group" id="hero-explore-btn">
                  Explore Events <FiArrowRight strokeWidth={2} className="text-lg group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-semibold border border-white/20 hover:bg-white/10 transition-all" id="hero-signup-btn">
                  Create Account
                </Link>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/10 border border-white/15 backdrop-blur-sm">
                  <div className="flex -space-x-2">
                    {[sherehe, pulse, heroImg].map((img, i) => (
                      <img key={i} src={img} alt="" className="w-8 h-8 rounded-full border-2 border-white/30 object-cover" />
                    ))}
                  </div>
                  <div className="h-6 w-px bg-white/20" />
                  <div>
                    <div className="flex items-center gap-1 mb-0.5">
                      {[1,2,3,4,5].map((s) => (
                        <svg key={s} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      ))}
                    </div>
                    <p className="text-xs text-white/90"><span className="font-bold text-white">12,000+</span> happy attendees</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block relative h-[480px]">
              <div className="absolute top-4 right-8 w-64 rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:scale-[1.02] transition-transform duration-500">
                <img src={sherehe} alt="Event" className="w-full h-36 object-cover" />
                <div className="bg-white p-4">
                  <p className="font-semibold text-heading text-sm">Sherehe Festival</p>
                  <p className="text-xs text-muted mt-1">Nairobi · May 2026</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-primary-dark font-bold">KES 2,000</span>
                    <span className="text-xs text-muted">1200 left</span>
                  </div>
                </div>
              </div>
              <div className="absolute top-40 left-0 w-60 rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:scale-[1.02] transition-transform duration-500">
                <img src={pulse} alt="Event" className="w-full h-32 object-cover" />
                <div className="bg-white p-4">
                  <p className="font-semibold text-heading text-sm">Tech Pulse 2026</p>
                  <p className="text-xs text-muted mt-1">Mombasa · June 2026</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs text-primary-dark font-bold">KES 3,500</span>
                    <span className="text-xs text-muted">200 left</span>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-4 right-16 w-56 rounded-2xl overflow-hidden shadow-2xl border border-white/10 hover:scale-[1.02] transition-transform duration-500">
                <img src={heroImg} alt="Event" className="w-full h-28 object-cover" />
                <div className="bg-white p-4">
                  <p className="font-semibold text-heading text-sm">Art & Soul Expo</p>
                  <p className="text-xs text-muted mt-1">Nakuru · July 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ FEATURED ═══ */}
      <section className="py-16 md:py-20 bg-surface-main" id="featured-events">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-outfit font-bold text-2xl md:text-3xl text-heading">Featured <span className="gradient-text">Events</span></h2>
              <p className="text-muted mt-2 text-sm">Don't miss out on these trending events</p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full border border-blue-20 flex items-center justify-center text-muted hover:text-primary hover:border-primary-lighter transition-colors"><FiChevronLeft size={18} strokeWidth={2} /></button>
              <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full border border-blue-20 flex items-center justify-center text-muted hover:text-primary hover:border-primary-lighter transition-colors"><FiChevronRight size={18} strokeWidth={2} /></button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => <EventCardSkeleton key={i} />)}
            </div>
          ) : (
            <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
              {featuredEvents.map((event, i) => (
                <div key={event.id} className="snap-start flex-shrink-0 w-[310px] md:w-[340px]">
                  <EventCard event={event} index={i} featured />
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-8">
            <Link to="/events" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark transition-colors text-sm font-medium group">
              View All Events <FiArrowRight strokeWidth={2} className="text-base group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="py-16 md:py-20 bg-white" id="categories-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-outfit font-bold text-2xl md:text-3xl text-heading">Browse by <span className="gradient-text">Category</span></h2>
            <p className="text-muted mt-2 text-sm">Find events that match your interests</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 stagger-children">
            {categories.map((cat) => (
              <Link key={cat.name} to={`/events?category=${encodeURIComponent(cat.name)}`}
                className="group p-6 rounded-2xl border border-blue-20 bg-white hover:border-primary-lighter hover:shadow-glow transition-all duration-500 hover:-translate-y-1 text-center animate-fade-in-up">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-[#f5f5f7] border border-transparent group-hover:border-blue-10 flex items-center justify-center text-gray-600 mb-4 group-hover:bg-white group-hover:text-primary group-hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] group-hover:-translate-y-1 transition-all duration-400">
                  {cat.icon}
                </div>
                <p className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">{cat.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section ref={statsRef} className="py-16 md:py-20 bg-blue-5" id="stats-section">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => <StatCard key={stat.label} stat={stat} inView={statsInView} />)}
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section className="py-16 md:py-20 bg-white" id="how-it-works">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="font-outfit font-bold text-2xl md:text-3xl text-heading">How It <span className="gradient-text">Works</span></h2>
            <p className="text-muted mt-2 text-sm">Three simple steps to your next event</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-blue-20 via-primary-lighter to-blue-20" />
            {steps.map((step) => (
              <div key={step.step} className="relative text-center group">
                <div className="w-24 h-24 mx-auto rounded-3xl bg-blue-5 border border-blue-20 flex items-center justify-center mb-6 group-hover:border-primary-lighter group-hover:shadow-glow transition-all duration-500">
                  <span className="font-outfit font-bold text-3xl gradient-text">{step.step}</span>
                </div>
                <h3 className="font-outfit font-bold text-lg text-heading mb-2">{step.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-16 md:py-24 bg-surface-main" id="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative rounded-3xl overflow-hidden p-10 md:p-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-primary to-blue-500 animate-gradient" />
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMS41IiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IGZpbGw9InVybCgjZykiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiLz48L3N2Zz4=')] opacity-30" />
            <div className="relative z-10">
              <h2 className="font-outfit font-bold text-3xl md:text-4xl text-white mb-4">Ready to Experience Something Amazing?</h2>
              <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">Join thousands who discover and attend the best events.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/events" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-primary font-bold bg-white hover:bg-blue-5 transition-all shadow-lg" id="cta-explore-btn">
                  Explore Events
                </Link>
                <Link to="/signup" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl text-white font-bold border-2 border-white/40 hover:bg-white/10 transition-all" id="cta-signup-btn">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
