const {flatRoutes} = require('remix-flat-routes');

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  postcss: true,
  tailwind: true,
  serverModuleFormat: 'cjs',
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
    v2_dev: true,
    v2_headers: true,
  },

  serverDependenciesToBundle: [
    'axios',
    '@white-label/ui-core',
    // todo: replace bcrypt with something else
    // https://github.com/kelektiv/node.bcrypt.js/issues/964
    'nock',
    'mock-aws-s3',
    'aws-sdk',
  ],
  ignoredRouteFiles: ['**/*'],
  routes: async (defineRoutes) => {
    return flatRoutes('routes', defineRoutes);
  },
};
