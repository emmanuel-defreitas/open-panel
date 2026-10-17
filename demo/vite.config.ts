import react from "@vitejs/plugin-react";
import { defaultClientConditions, defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [react()],
  // Resolve workspace packages to their TypeScript source instead of dist.
  resolve: { conditions: ["source", ...defaultClientConditions], dedupe: ["react", "react-dom"] },
  server: { port: 5312 },
});
