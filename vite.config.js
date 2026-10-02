import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],

    server: {
      proxy: {
        "/api/news": {
          target: "https://gnews.io",
          changeOrigin: true,

          rewrite: (path) => {
            const url = new URL(
              path,
              "http://localhost"
            );

            const searchMode =
              url.searchParams.get("mode") === "search";

            url.searchParams.delete("mode");
            url.searchParams.set("lang", "en");
            url.searchParams.set("max", "10");
            url.searchParams.set(
              "apikey",
              env.GNEWS_API_KEY || ""
            );

            if (!searchMode) {
              url.searchParams.set("country", "pk");
            }

            return (
              "/api/v4/" +
              (searchMode ? "search" : "top-headlines") +
              "?" +
              url.searchParams.toString()
            );
          },
        },
      },
    },
  };
});