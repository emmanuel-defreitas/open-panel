// Inlines the @import lines of src/style.css into one file, keeping import order (the cascade order).
// Usage: node build-css.mjs <outfile>
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const entry = resolve(dirname(fileURLToPath(import.meta.url)), "../src/style.css");
const out = resolve(process.argv[2] ?? "dist/style.css");

const inline = (file) =>
  readFileSync(file, "utf8").replace(/^@import\s+["'](.+?)["'];\s*$/gm, (_, path) =>
    inline(resolve(dirname(file), path)).trimEnd(),
  );

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, inline(entry));
