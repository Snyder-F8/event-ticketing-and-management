import React from "react";
import { bestevents } from "../utils/constant";

const LiveEvents = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold mb-6">Best of live Events</h2>
      <div className="grid grid-cols2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {bestevents.map((bestevent, i) => (
          <div className="rounded-xl overflow-hidden relative group shadow-sm cursor-pointer">
            <img
              src={bestevent.img}
              alt={bestevent.title}
              className="w-full h-56 object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveEvents;
