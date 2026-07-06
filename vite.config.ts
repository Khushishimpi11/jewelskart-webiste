import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const isProduction = mode === "production" || env.VITE_ENV_MODE === "production";
  const apiUrl = isProduction
    ? "https://jewelskart-backend-gt7z.onrender.com/api"
    : "http://localhost:5000/api";
  
  process.env.VITE_API_URL = apiUrl;

  return {
    server: {
    host: "::",
    port: 8080,
  },

  plugins: [
    react(),

    mode === "development" && componentTagger(),

    // ✅ PWA Plugin
    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        name: "JewelsKart",
        short_name: "JewelsKart",
        description: "Premium Jewellery Shopping App 💎",
        theme_color: "#540f29",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",

        icons: [
          {
            src: "/logo1.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/logoicon.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ].filter(Boolean),

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  };
});