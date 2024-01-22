/// <reference types="vitest" />

import {unstable_vitePlugin as remix} from '@remix-run/dev';
import {flatRoutes} from 'remix-flat-routes';
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ['**/*'],
      // eslint-disable-next-line @typescript-eslint/require-await
      routes: async (defineRoutes) => {
        return flatRoutes('routes', defineRoutes);
      },
      serverModuleFormat: 'esm',
    }),
    tsconfigPaths(),
  ],
  test: {
    // allows you to use stuff like describe, it, vi without importing
    globals: true,
    // disables multi-threading and runs test serially, you can change this
    threads: false,
    // Path to your setup script that we will go into detail below
    // setupFiles: ["./tests/setup.integration.ts"],
    // Up to you, I usually put my integration tests inside of integration
    // folders
    // include: ["./app/**/integration/*.test.ts"]
  },
});
