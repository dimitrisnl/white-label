import * as Effect from 'effect/Effect';

import {pool} from '~/core/db/pool.server';
import {db} from '~/core/db/schema.server';
import {InvitationNotFoundError} from '~/core/lib/errors.server';
import {BadRequest, Ok, ServerError} from '~/core/lib/responses.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';
import {declineInvitation} from '~/core/use-cases/decline-invitation.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request} = yield* _(LoaderArgs);

    const url = new URL(request.url);
    const invitationId = url.searchParams.get('invitationId');

    if (!invitationId) {
      return yield* _(Effect.fail(new InvitationNotFoundError()));
    }

    const {validate, execute} = declineInvitation({db, pool});
    const props = yield* _(validate({invitationId}));

    yield* _(execute(props));

    return new Ok({data: null});
  }).pipe(
    Effect.catchTags({
      InternalServerError: () => Effect.fail(new ServerError()),
      InvitationNotFoundError: () =>
        Effect.fail(new BadRequest({errors: ['Invitation not found']})),
      ValidationError: ({errors}) => Effect.fail(new BadRequest({errors})),
    })
  )
);

export type ResetPasswordLoader = typeof loader;
