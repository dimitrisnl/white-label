// vite.config.ts
import { unstable_vitePlugin as remix } from "file:///workspace/white-label/node_modules/.pnpm/@remix-run+dev@2.5.1_@remix-run+serve@2.5.1_@types+node@20.11.5_ts-node@10.9.2_typescript@5.3.3_vite@5.0.12/node_modules/@remix-run/dev/dist/index.js";
import { flatRoutes } from "file:///workspace/white-label/node_modules/.pnpm/remix-flat-routes@0.6.4_@remix-run+dev@2.5.1/node_modules/remix-flat-routes/dist/index.js";
import { defineConfig } from "file:///workspace/white-label/node_modules/.pnpm/vite@5.0.12_@types+node@20.11.5/node_modules/vite/dist/node/index.js";
import tsconfigPaths from "file:///workspace/white-label/node_modules/.pnpm/vite-tsconfig-paths@4.3.1_typescript@5.3.3_vite@5.0.12/node_modules/vite-tsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*"],
      // eslint-disable-next-line @typescript-eslint/require-await
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes);
      },
      serverModuleFormat: "esm"
    }),
    tsconfigPaths()
  ],
  test: {
    // allows you to use stuff like describe, it, vi without importing
    globals: true,
    // disables multi-threading and runs test serially, you can change this
    threads: false
    // Path to your setup script that we will go into detail below
    // setupFiles: ["./tests/setup.integration.ts"],
    // Up to you, I usually put my integration tests inside of integration
    // folders
    // include: ["./app/**/integration/*.test.ts"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvd29ya3NwYWNlL3doaXRlLWxhYmVsXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvd29ya3NwYWNlL3doaXRlLWxhYmVsL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy93b3Jrc3BhY2Uvd2hpdGUtbGFiZWwvdml0ZS5jb25maWcudHNcIjsvLy8gPHJlZmVyZW5jZSB0eXBlcz1cInZpdGVzdFwiIC8+XG5cbmltcG9ydCB7dW5zdGFibGVfdml0ZVBsdWdpbiBhcyByZW1peH0gZnJvbSAnQHJlbWl4LXJ1bi9kZXYnO1xuaW1wb3J0IHtmbGF0Um91dGVzfSBmcm9tICdyZW1peC1mbGF0LXJvdXRlcyc7XG5pbXBvcnQge2RlZmluZUNvbmZpZ30gZnJvbSAndml0ZSc7XG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tICd2aXRlLXRzY29uZmlnLXBhdGhzJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlbWl4KHtcbiAgICAgIGlnbm9yZWRSb3V0ZUZpbGVzOiBbJyoqLyonXSxcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvcmVxdWlyZS1hd2FpdFxuICAgICAgcm91dGVzOiBhc3luYyAoZGVmaW5lUm91dGVzKSA9PiB7XG4gICAgICAgIHJldHVybiBmbGF0Um91dGVzKCdyb3V0ZXMnLCBkZWZpbmVSb3V0ZXMpO1xuICAgICAgfSxcbiAgICAgIHNlcnZlck1vZHVsZUZvcm1hdDogJ2VzbScsXG4gICAgfSksXG4gICAgdHNjb25maWdQYXRocygpLFxuICBdLFxuICB0ZXN0OiB7XG4gICAgLy8gYWxsb3dzIHlvdSB0byB1c2Ugc3R1ZmYgbGlrZSBkZXNjcmliZSwgaXQsIHZpIHdpdGhvdXQgaW1wb3J0aW5nXG4gICAgZ2xvYmFsczogdHJ1ZSxcbiAgICAvLyBkaXNhYmxlcyBtdWx0aS10aHJlYWRpbmcgYW5kIHJ1bnMgdGVzdCBzZXJpYWxseSwgeW91IGNhbiBjaGFuZ2UgdGhpc1xuICAgIHRocmVhZHM6IGZhbHNlLFxuICAgIC8vIFBhdGggdG8geW91ciBzZXR1cCBzY3JpcHQgdGhhdCB3ZSB3aWxsIGdvIGludG8gZGV0YWlsIGJlbG93XG4gICAgLy8gc2V0dXBGaWxlczogW1wiLi90ZXN0cy9zZXR1cC5pbnRlZ3JhdGlvbi50c1wiXSxcbiAgICAvLyBVcCB0byB5b3UsIEkgdXN1YWxseSBwdXQgbXkgaW50ZWdyYXRpb24gdGVzdHMgaW5zaWRlIG9mIGludGVncmF0aW9uXG4gICAgLy8gZm9sZGVyc1xuICAgIC8vIGluY2x1ZGU6IFtcIi4vYXBwLyoqL2ludGVncmF0aW9uLyoudGVzdC50c1wiXVxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBRUEsU0FBUSx1QkFBdUIsYUFBWTtBQUMzQyxTQUFRLGtCQUFpQjtBQUN6QixTQUFRLG9CQUFtQjtBQUMzQixPQUFPLG1CQUFtQjtBQUUxQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsTUFDSixtQkFBbUIsQ0FBQyxNQUFNO0FBQUE7QUFBQSxNQUUxQixRQUFRLE9BQU8saUJBQWlCO0FBQzlCLGVBQU8sV0FBVyxVQUFVLFlBQVk7QUFBQSxNQUMxQztBQUFBLE1BQ0Esb0JBQW9CO0FBQUEsSUFDdEIsQ0FBQztBQUFBLElBQ0QsY0FBYztBQUFBLEVBQ2hCO0FBQUEsRUFDQSxNQUFNO0FBQUE7QUFBQSxJQUVKLFNBQVM7QUFBQTtBQUFBLElBRVQsU0FBUztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU1YO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
