import React from "react";
import { languages } from "../../utils/constant";
import { allEvents } from "../../utils/constant";
import EventCard from "./EventCard";

const EventList = () => {
  return (
    <div className="w-full md:w-3/4 p-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {languages.map((lang, i) => (
          <span
            key={i}
            className="bg-white border border-gray-200 text-[#3f6fb8] py-1 px-3 rounded-[24px] text-sm cursor-pointer hover:bg-gray-100"
          >
            {lang}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center bg-white pc-6 py-6 rounded mb-6">
        <h3 className="font-semibold text-xl">Coming Soon</h3>
        <a
          href="#"
          className=" text-[#3f6fb8] text-sm font-medium flex items-center"
        >
          Explore upcoming Events <span className="ml-1">➡</span>
        </a>
      </div>

      <div className="flex flex-wrap gap-6">
        {allEvents.map((event, i) => (
          <EventCard key={i} {...event} />
        ))}
      </div>
    </div>
  );
};

export default EventList;
