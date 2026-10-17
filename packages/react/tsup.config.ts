import { defineConfig } from "tsup";
export default defineConfig({
  entry: ["src/index.ts", "src/glass.tsx", "src/sounds.ts"],
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  target: "es2022",
  external: [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "open-panel-core",
    "@samasante/liquid-glass",
    "cuelume",
  ],
});
