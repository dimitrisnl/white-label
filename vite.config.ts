/// <reference types="vitest" />

import {vitePlugin as remix} from '@remix-run/dev';
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
        routes: async (defineRoutes) => {
          return flatRoutes('routes', defineRoutes);
        },
        serverBundles: ({branch}) => {
          const isGuestRoute = branch.some((route) =>
            route.id.split('/').includes('_guest')
          );

          return isGuestRoute ? 'guest' : 'authenticated';
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
