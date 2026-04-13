// src/components/Header.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { FaBars, FaTimes, FaSignOutAlt, FaTachometerAlt, FaTicketAlt } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Events", path: "/events" },
    { name: "My Tickets", path: "/my-tickets" },
  ];

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const getDashboardPath = () => {
    if (!user) return null;
    const role = user.role?.toLowerCase();
    if (role === "admin") return "/admin";
    if (role === "organizer") return "/organizer";
    return null;
  };

  const getRoleBadgeColor = () => {
    if (!user) return "";
    const role = user.role?.toLowerCase();
    if (role === "admin") return "bg-red-50 text-red-600 border-red-200";
    if (role === "organizer") return "bg-emerald-50 text-emerald-600 border-emerald-200";
    return "bg-blue-5 text-blue-600 border-blue-20";
  };

  return (
    <>
      <header
        id="main-navbar"
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-white/90 backdrop-blur-lg shadow-md border-b border-blue-20 py-2"
            : "bg-white/70 backdrop-blur-sm py-3"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group" id="nav-logo">
            <img
              src={logo}
              alt="Ticket Vibez"
              className="h-10 w-10 rounded-full object-contain transition-transform duration-300 group-hover:scale-110"
            />
            <span className="font-outfit font-bold text-xl text-heading tracking-tight">
              Ticket <span className="gradient-text">Vibez</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1" id="nav-links-desktop">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? "text-primary-dark bg-blue-5"
                    : "text-gray-600 hover:text-primary hover:bg-blue-5"
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-3" id="nav-auth-desktop">
            {token && user ? (
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-xl border border-blue-20 hover:border-blue-30 transition-all duration-300 hover:bg-blue-5"
                  id="profile-dropdown-btn"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span className="text-sm text-gray-700 font-medium max-w-[120px] truncate">
                    {user.name || "User"}
                  </span>
                  <svg
                    className={`w-3 h-3 text-gray-400 transition-transform duration-300 ${profileOpen ? "rotate-180" : ""}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-card-hover border border-blue-20 overflow-hidden animate-scale-in" id="profile-dropdown-menu">
                    <div className="p-4 border-b border-blue-10 bg-blue-5">
                      <p className="text-sm font-semibold text-heading">{user.name}</p>
                      <p className="text-xs text-muted mt-0.5">{user.email}</p>
                      <span className={`inline-block mt-2 px-2 py-0.5 rounded border text-xs font-medium capitalize ${getRoleBadgeColor()}`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="p-2">
                      {getDashboardPath() && (
                        <Link
                          to={getDashboardPath()}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-5 hover:text-primary transition-colors"
                        >
                          <FaTachometerAlt className="text-primary-light" />
                          Dashboard
                        </Link>
                      )}
                      <Link
                        to="/my-tickets"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-700 hover:bg-blue-5 hover:text-primary transition-colors"
                      >
                        <FaTicketAlt className="text-primary" />
                        My Tickets
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 transition-colors"
                        id="logout-btn"
                      >
                        <FaSignOutAlt />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-primary border border-blue-20 hover:border-primary-lighter hover:bg-blue-5 transition-all duration-300"
                  id="nav-login-btn"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover transition-all duration-300 shadow-glow"
                  id="nav-signup-btn"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-primary hover:bg-blue-5 transition-colors"
            id="mobile-menu-btn"
          >
            {mobileOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden" id="mobile-menu-overlay">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div
            className="absolute top-0 left-0 bottom-0 w-72 bg-white border-r border-blue-20 shadow-2xl"
            style={{ animation: "slideInLeft 0.3s ease-out" }}
          >
            <div className="p-5 border-b border-blue-10 flex items-center gap-3">
              <img src={logo} alt="Ticket Vibez" className="h-9 w-9 rounded-full object-contain" />
              <span className="font-outfit font-bold text-lg text-heading">Ticket Vibez</span>
            </div>

            {token && user && (
              <div className="p-4 border-b border-blue-10 bg-blue-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold">
                    {user.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-heading">{user.name}</p>
                    <span className={`inline-block mt-0.5 px-2 py-0.5 rounded border text-xs font-medium capitalize ${getRoleBadgeColor()}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <nav className="p-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? "bg-blue-5 text-primary-dark"
                      : "text-gray-600 hover:bg-blue-5 hover:text-primary"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {token && user && getDashboardPath() && (
                <Link
                  to={getDashboardPath()}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-gray-600 hover:bg-blue-5 hover:text-primary"
                >
                  Dashboard
                </Link>
              )}
            </nav>

            <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-10">
              {token ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm text-red-500 border border-red-200 hover:bg-red-50 transition-colors"
                >
                  <FaSignOutAlt /> Logout
                </button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link to="/login" className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-700 border border-blue-20 hover:bg-blue-5">
                    Login
                  </Link>
                  <Link to="/signup" className="w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-hover">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="h-16 md:h-[60px]" />
    </>
  );
}