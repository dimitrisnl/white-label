const {flatRoutes} = require('remix-flat-routes');

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverModuleFormat: 'cjs',
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
