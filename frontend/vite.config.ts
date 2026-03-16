import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  // 🔧 PRODUCTION 必須
  base: "./", // 絕對路徑，解決你嘅 Docker white screen
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    manifest: true, // 穩定 manifest.json
    sourcemap: false, // 減少 bundle 大小
  },
});
