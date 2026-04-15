import React from "react";

export default function DashboardCard({ title, value }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-blue-600 mt-2">{value}</h2>
    </div>
  );
}