import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  server: {
    port: 4000,
    strictPort: true,
    open: true,
    allowedHosts: ["kabob-plywood-deflector.ngrok-free.dev", ".ngrok-free.dev"],

    proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          //here \/ here / means ends if we want to tell computer that / this is not end the use \ which say after it is normal string not end \ it says take as special words like function digit routes etc starts
          rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  }
});
