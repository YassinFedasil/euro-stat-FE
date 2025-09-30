import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,      // force le port 5173
    strictPort: true // si 5173 est déjà pris, ça plante au lieu de choisir un autre port
  }
});
