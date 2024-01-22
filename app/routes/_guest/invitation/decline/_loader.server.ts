import * as Effect from 'effect/Effect';

import {InvitationNotFoundError} from '~/core/lib/errors.server';
import {BadRequest, Ok, ServerError} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {declineInvitation} from '~/core/use-cases/decline-invitation.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(_guest/invitation/decline): Init'));
    const {request} = yield* _(LoaderArgs);

    const url = new URL(request.url);
    const invitationId = url.searchParams.get('invitationId');

    if (!invitationId) {
      return yield* _(Effect.fail(new InvitationNotFoundError()));
    }

    const {validate, execute} = declineInvitation();
    const props = yield* _(validate({invitationId}));

    yield* _(execute(props));

    return new Ok({data: {}});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError({})),
      InvitationNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ['Invitation not found']})),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
    })
  )
);

export type ResetPasswordLoader = typeof loader;
