import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      "/api/news": {
        target: "https://gnews.io",
        changeOrigin: true,
        rewrite: (path) =>
          path.replace(/^\/api\/news/, "/api/v4"),
      },
    },
  },
});