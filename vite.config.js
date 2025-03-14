import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "index.html", // Default entry
        timeline: "timeline.html", // Add timeline.html here
      },
    },
  },
});
