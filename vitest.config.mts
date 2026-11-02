import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    clearMocks: true,
    restoreMocks: true,
    // Módulos críticos con cobertura exigida (pnpm test:coverage).
    coverage: {
      provider: "v8",
      include: ["lib/ia/**/*.ts"],
      exclude: ["**/*.test.ts"],
      reporter: ["text", "html"],
      reportsDirectory: "scratch/coverage",
      thresholds: { lines: 80, functions: 80, branches: 80, statements: 80 },
    },
  },
});
