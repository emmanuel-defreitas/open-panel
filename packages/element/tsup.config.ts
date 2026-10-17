import { defineConfig } from "tsup";
export default defineConfig([
    {
        entry: ["src/index.ts"],
        format: ["esm"],
        dts: true,
        sourcemap: true,
        clean: true,
        target: "es2022",
        external: ["open-panel-core"],
    },
    {
        // A single file for <script type="module"> use without a bundler.
        entry: { "open-panel-element.standalone": "src/index.ts" },
        format: ["esm"],
        minify: true,
        sourcemap: true,
        target: "es2022",
        noExternal: ["open-panel-core"],
    },
]);
