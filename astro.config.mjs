// astro.config.mjs
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel"; // ← Changed: Remove /serverless

export default defineConfig({
  output: "server", // ← Changed: Use "server" instead of "hybrid"
  adapter: vercel(),
  vite: {
    plugins: [tailwindcss()],
    optimizeDeps: {
      include: ["qrcode"],
      exclude: ["jsonwebtoken"], // Exclude from optimization
    },
    ssr: {
      noExternal: ["qrcode"],
      external: ["jsonwebtoken"], // Keep jsonwebtoken server-side
    },
  },
});
