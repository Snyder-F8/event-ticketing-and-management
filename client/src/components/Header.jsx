import React from "react";
import mainLogo from "../assets/vibezlogo.png";
import { FaSearch } from "react-icons/fa";
import { useLocation } from "../context/LocationContext";
import map from "../assets/map.png";

const Header = () => {
  const { location, loading, error } = useLocation();

  return (
    <div className="w-full text-sm bg-white">
      {/* Tob Navbar */}
      <div className="px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center py-3">
          {/* left part */}
          <div className="flex items-center space-x-4">
            <img
              src={mainLogo}
              alt="logo"
              className="h-10 md:h-14 lg:h-16 object-contain cursor-pointer"
            />

            <div className="relative">
              <input
                type="text"
                placeholder="Search for Academic,Social, Sports & Cultural events"
                className="border border-gray-300 rounded px-4 py-1.5 w-[400px] text-sm outline-none"
              />
              <FaSearch className="absolute right-2 top-2.5 text-gray-500" />
            </div>
          </div>
          {/* Right part */}

          <div className="flex item-center space-x-6">
            <div className="flex items-center space-x-2 text-sm font-medium cursor-pointer">
              {loading && (
                <img src={map} alt="loading..." className="w-5 h-5" />
              )}

              {location && <p className="whitespace-nowrap">{location}</p>}
            </div>
            <button className="bg-[#3f6fb8] cursor-pointer text-white px-4 py-1.5 rounded text-sm">
              Sign in
            </button>
          </div>
        </div>
      </div>

      {/* Bottom navbar */}
      <div className="bg-[#f2f2f2] px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto flex justify-between items-center py-2 text-gray-700">
          <div className="flex items-center space-x-6 font-medium">
            <span className="cursor-pointer hover:text-[#00bf63]">
              Academic Events
            </span>
            <span className="cursor-pointer hover:text-[#00bf63]">
              Social Events
            </span>
            <span className="cursor-pointer hover:text-[#00bf63]">
              Sports Events
            </span>
            <span className="cursor-pointer hover:text-[#00bf63]">
              Cultural Events
            </span>
          </div>
          <div className="flex item-center space-x-6 text-sm">
            <span className="cursor-pointer hover:underline">List Events</span>
            <span className="cursor-pointer hover:underline">Book Events</span>
            <span className="cursor-pointer hover:underline">Tickets</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
