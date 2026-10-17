import { defaultClientConditions, defaultServerConditions } from "vite";
import { defineConfig } from "vitest/config";

// Resolve workspace packages to their TypeScript source instead of dist.
const SOURCE_CONDITION = "source";

export default defineConfig({
  resolve: { conditions: [SOURCE_CONDITION, ...defaultClientConditions] },
  ssr: { resolve: { conditions: [SOURCE_CONDITION, ...defaultServerConditions] } },
  test: {
    include: ["packages/*/test/**/*.test.{ts,tsx}"],
    environment: "node",
    environmentMatchGlobs: [["packages/*/test/**/*.dom.test.{ts,tsx}", "jsdom"]],
  },
});
