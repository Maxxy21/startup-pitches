import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

const alias = [
  { find: /^@\/convex\/(.*)$/, replacement: path.resolve(__dirname, "./convex/$1") },
  { find: /^@\/(.*)$/, replacement: path.resolve(__dirname, "./src/$1") },
];

export default defineConfig({
  resolve: { alias },
  test: {
    projects: [
      {
        resolve: { alias },
        plugins: [react()],
        test: {
          name: "ui",
          environment: "jsdom",
          globals: true,
          setupFiles: ["./test-setup.ts"],
          include: ["src/**/*.{test,spec}.{ts,tsx}"],
        },
      },
      {
        resolve: { alias },
        test: {
          name: "convex",
          environment: "edge-runtime",
          include: ["convex/**/*.test.ts"],
        },
      },
    ],
  },
});
