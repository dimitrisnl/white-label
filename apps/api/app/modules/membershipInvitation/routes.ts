import Route from '@ioc:Adonis/Core/Route';

Route.group(() => {
  Route.get('/', async (ctx) => {
    const {MembershipInvitationController} = await import(
      './controllers/MembershipInvitationController'
    );
    return new MembershipInvitationController().index(ctx);
  });

  Route.post('/', async (ctx) => {
    const {MembershipInvitationController} = await import(
      './controllers/MembershipInvitationController'
    );
    return new MembershipInvitationController().create(ctx);
  });

  Route.delete('/:invitationId', async (ctx) => {
    const {MembershipInvitationController} = await import(
      './controllers/MembershipInvitationController'
    );
    return new MembershipInvitationController().delete(ctx);
  });
})
  .middleware(['auth', 'loadOrg'])
  .prefix('api/v1/membership-invitations/');

Route.group(() => {
  Route.post('/:invitationId/accept', async (ctx) => {
    const {MembershipInvitationController} = await import(
      './controllers/MembershipInvitationController'
    );
    return new MembershipInvitationController().accept(ctx);
  });

  Route.patch('/:invitationId/decline', async (ctx) => {
    const {MembershipInvitationController} = await import(
      './controllers/MembershipInvitationController'
    );
    return new MembershipInvitationController().decline(ctx);
  });
}).prefix('api/v1/membership-invitation/');
