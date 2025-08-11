import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ filename: "stats.html", gzipSize: true }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2020",
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react")) return "vendor-react";
          if (id.includes("@tanstack")) return "vendor-query";
          if (id.includes("axios")) return "vendor-axios";
          if (id.includes("@radix-ui") || id.includes("cmdk"))
            return "vendor-ui";
          if (id.includes("lucide-react")) return "vendor-icons";
          if (id.includes("sonner")) return "vendor-toasts";

          return "vendor-misc";
        },
      },
    },
  },
});
