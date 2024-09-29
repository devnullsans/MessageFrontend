import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   proxy: {
  //     "/api": {
  //       target: "https://http://192.168.1.47:8000", // Replace with your backend HTTPS IP
  //       changeOrigin: true,
  //       secure: true, // Set to true if backend uses a valid HTTPS certificate
  //       ws: true,
  //     },
  //   },
  // },
});
