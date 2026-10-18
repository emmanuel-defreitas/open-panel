import { defineConfig } from "tsup";
export default defineConfig({
  entry: ["src/index.ts", "src/glass.tsx", "src/sounds.ts"],
  format: ["esm"],
  dts: { resolve: ["open-panel-core"] },
  noExternal: ["open-panel-core"],
  sourcemap: true,
  clean: true,
  target: "es2022",
  external: ["react", "react-dom", "react/jsx-runtime", "@samasante/liquid-glass", "cuelume"],
});
