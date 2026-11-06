import { configDefaults, defineConfig } from "vitest/config";

const isCI = process.env.CI?.toLowerCase() === "true";

export default defineConfig({
  test: {
    clearMocks: true,
    ...(isCI
      ? { testTimeout: 30_000 }
      : { exclude: ["test/e2e/**", ...configDefaults.exclude] }),
  },
});
