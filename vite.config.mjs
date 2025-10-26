import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  root: "src",
  publicDir: '../public/',
  build: {
    copyPublicDir: true,
    outDir: "../dist",
    emptyOutDir: true,
  },
  plugins: [vue()],
});
