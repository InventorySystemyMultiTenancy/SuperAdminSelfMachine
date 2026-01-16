import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Proxy para redirecionar chamadas /api para o backend
    proxy: {
      "/api": {
        target: process.env.VITE_API_URL || "http://localhost:3001/api",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  // Preview (build) também precisa do fallback
  preview: {
    port: 4173,
  },
});
