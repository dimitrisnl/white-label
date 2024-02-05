/// <reference types="vitest" />

import {unstable_vitePlugin as remix} from '@remix-run/dev';
import {installGlobals} from '@remix-run/node';
import {flatRoutes} from 'remix-flat-routes';
import {visualizer} from 'rollup-plugin-visualizer';
import {defineConfig} from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

installGlobals();

const isVitest = Boolean(process.env.VITEST);
const isStorybook = Boolean(process.argv[1]?.includes('storybook'));

export default defineConfig({
  plugins: [
    !isVitest &&
      !isStorybook &&
      remix({
        ignoredRouteFiles: ['**/*'],
        // eslint-disable-next-line @typescript-eslint/require-await
        routes: async (defineRoutes) => {
          return flatRoutes('routes', defineRoutes);
        },
      }),
    tsconfigPaths(),
    visualizer({emitFile: true}),
  ],
  test: {
    environment: 'node',
    globals: true,
    // todo: add setupFiles
  },
});
