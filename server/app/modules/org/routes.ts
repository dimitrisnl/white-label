import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', async (ctx) => {
    const {OrgController} = await import('./controllers/OrgController');
    return new OrgController().get(ctx);
  }).middleware(['loadOrg']);

  Route.post('/', async (ctx) => {
    const {OrgController} = await import('./controllers/OrgController');
    return new OrgController().create(ctx);
  });

  Route.patch('/', async (ctx) => {
    const {OrgController} = await import('./controllers/OrgController');
    return new OrgController().update(ctx);
  }).middleware(['loadOrg']);
})
  .middleware(['auth'])
  .prefix('api/v1/orgs/');
