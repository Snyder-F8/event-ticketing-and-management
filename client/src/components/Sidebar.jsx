import React from "react";
import { FaSignOutAlt } from "react-icons/fa";
import logo from "../assets/logo.png";

export default function Sidebar({ links }) {
  return (
    <aside className="w-64 bg-[#0B1E3A] text-white flex flex-col min-h-screen shadow-xl">
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-white/10">
        <img src={logo} className="w-10 h-10 object-contain" />
        <h1 className="text-lg font-bold">Ticket Vibez</h1>
      </div>

      {/* Links */}
      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <div
            key={link.name}
            className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-600/20 transition cursor-pointer"
          >
            {link.icon}
            <span className="text-sm">{link.name}</span>
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 p-3 hover:bg-red-500/20 rounded-lg cursor-pointer">
          <FaSignOutAlt /> Logout
        </div>
      </div>
    </aside>
  );
}