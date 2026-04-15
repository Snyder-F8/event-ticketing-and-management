import React from "react";
import logo from "../assets/logo.png";

export default function Topbar({ title, subtitle, role }) {
  return (
    <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow mb-6">
      <div>
        <h1 className="text-xl font-bold text-[#03193E]">{title}</h1>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <img src={logo} className="w-10 h-10 rounded-full" />
        <span className="font-medium text-gray-700">{role}</span>
      </div>
    </div>
  );
}