import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

// base "./" + hash routing: el build funciona servido desde cualquier carpeta
// (GitHub Pages, un servidor estático o una demo publicada).
export default defineConfig({
  base: "./",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  server: { host: true, port: 5173 },
  build: { chunkSizeWarningLimit: 1500 },
});
