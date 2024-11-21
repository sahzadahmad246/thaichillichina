import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/local-api": "http://localhost:5000", 
      "prod": "https://thaichillichina.onrender.com"
    },
  },
  plugins: [react()],
});

