import Server from '@ioc:Adonis/Core/Server';

Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParser'),
  () => import('@/app/middleware/SilentAuth'),
]);

Server.middleware.registerNamed({
  auth: () => import('@/app/middleware/Auth'),
  emailVerified: () => import('@/app/middleware/EmailVerified'),
  loadOrg: () => import('@/app/middleware/LoadOrg'),
});
