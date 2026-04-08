// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react({
      registerType: "autoUpdate",
      manifest: {
        name: "Event System",
        short_name: "Events",
        theme_color: "#1B6CF5",
      },
    }),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Event System",
        short_name: "Events",
        theme_color: "#1B6CF5",
      },
    }),
  ],
});