import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/local-api": "http://localhost:5000", // Localhost proxy
    },
  },
  plugins: [react()],
});

