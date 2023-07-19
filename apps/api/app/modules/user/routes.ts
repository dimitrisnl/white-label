import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.post('register', async (ctx) => {
    const {AuthController} = await import('./controllers/AuthController');
    return new AuthController().register(ctx);
  });

  Route.post('login', async (ctx) => {
    const {AuthController} = await import('./controllers/AuthController');
    return new AuthController().login(ctx);
  });

  // Authenticated routes
  Route.post('logout', async (ctx) => {
    const {AuthController} = await import('./controllers/AuthController');
    return new AuthController().logout(ctx);
  }).middleware('auth');
}).prefix('api/v1/auth/');

Route.get('me', async (ctx) => {
  const {UserController} = await import('./controllers/UserController');
  return new UserController().whoAmI(ctx);
})
  .middleware('auth')
  .prefix('api/v1/');

Route.patch('me', async (ctx) => {
  const {UserController} = await import('./controllers/UserController');
  return new UserController().editUser(ctx);
})
  .middleware('auth')
  .prefix('api/v1/');

Route.post('verify/:token', async (ctx) => {
  const {UserController} = await import('./controllers/UserController');
  return new UserController().verifyEmail(ctx);
}).prefix('api/v1/email/');

Route.group(() => {
  Route.post('reset', async (ctx) => {
    const {UserController} = await import('./controllers/UserController');
    return new UserController().resetPassword(ctx);
  });

  Route.post('forgot', async (ctx) => {
    const {UserController} = await import('./controllers/UserController');
    return new UserController().requestPasswordReset(ctx);
  });

  Route.post('verify', async (ctx) => {
    const {UserController} = await import('./controllers/UserController');
    return new UserController().verifyPasswordReset(ctx);
  });

  Route.patch('change', async (ctx) => {
    const {UserController} = await import('./controllers/UserController');
    return new UserController().changePassword(ctx);
  }).middleware('auth');
}).prefix('api/v1/password/');
