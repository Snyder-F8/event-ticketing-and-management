import React from "react";
import mainLogo from "../assets/vibezlogo.png";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#2b2b2b] text-gray-400 text-sm">
      <div className="border-t border-gray-600 w-full" />
      <div className="flex flex-col items-center py-6">
        <img
          src={mainLogo}
          alt="Logo"
          className="h-10 md:h-14 lg:h-16 object-contain mb-4"
        />

        <div className="flex space-x-4 mb-4">
          <FaFacebookF className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white" />
          <FaTwitter className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white" />
          <FaInstagram className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white" />
          <FaLinkedin className="w-8 h-8 p-2 rounded-full bg-gray-700 text-white" />
        </div>

        <p className="text-center text-xs px-4 max-w-4xl">
          Copyright © 2026 Tickets Vibez. All Rights Reserved <br />
        </p>
        <small>
          All content, trademarks, and data on this platform are the property of
          Tickets Vibez and are protected by applicable copyright laws.
        </small>
      </div>
    </footer>
  );
};

export default Footer;
