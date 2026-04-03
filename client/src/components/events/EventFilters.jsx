import React from "react";
import { languages } from "../../utils/constant";

const EventFilters = () => {
  return (
    <div className="w-full md:w-1/4 p-4 space-y-6">
      <h2 className="text-2xl font-semibold">Filters</h2>
      {/* language */}

      <div className="bg-white p-4 rounded-md">
        <div className="flex justify-between items-center mb-2">
          <span className="font-medium">languages</span>
          <button className="text-[#3f6fb8]">Clear</button>
        </div>

        <div className="flex flex-wrap gap-2">
          {languages.map((lang, i) => (
            <span className="border border-gray-200 text-[#3f6fb8] px-3 py-1 text-sm rounded hover:bg-gray-100 curso-pointer">
              {lang}
            </span>
          ))}
        </div>
      </div>

      {/* events category */}
      <div className="bg-white mt-3 p-4 rounded">
        <div className="flex justify-between items-center mb-2">
          <span className=" font-medium">Categories</span>
          <button className="text-[#3f6fb8] text-sm">Clear</button>
        </div>
      </div>

      <div className="bg-white mt-3 p-4 rounded">
        <div className="flex justify-between items-center mb-2">
          <span className=" font-medium">Format</span>
          <button className="text-[#3f6fb8] text-sm">Clear</button>
        </div>
      </div>

      <button className="w-full border cursor-pointer border-[#3f6fb8] text-[#3f6fb8] py-1 rounded hover:bg-[#3f6fb8] hover:text-white transition">
        Filter
      </button>
    </div>
  );
};

export default EventFilters;
