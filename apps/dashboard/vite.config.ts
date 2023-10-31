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
});
