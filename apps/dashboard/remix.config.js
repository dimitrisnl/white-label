const {flatRoutes} = require('remix-flat-routes');

/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  serverModuleFormat: 'cjs',
  serverDependenciesToBundle: [
    '@white-label/ui-core',
    '@sindresorhus/slugify',
    'escape-string-regexp',
    '@sindresorhus/transliterate',
  ],
  ignoredRouteFiles: ['**/*'],
  routes: async (defineRoutes) => {
    return flatRoutes('routes', defineRoutes);
  },
};
