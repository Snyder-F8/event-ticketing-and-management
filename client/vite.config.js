<<<<<<< HEAD
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";
=======
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
>>>>>>> c109806 (Work in progress: dashboards, auth UI, PWA setup)

import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
<<<<<<< HEAD
  plugins: [react(),tailwindcss()],
})
=======
  plugins: [
    react({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Event System',
        short_name: 'Events',
        theme_color: '#1B6CF5',
      },
    }),
  ],
});
>>>>>>> c109806 (Work in progress: dashboards, auth UI, PWA setup)
