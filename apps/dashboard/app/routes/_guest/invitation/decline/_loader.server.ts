import * as Effect from 'effect/Effect';

import {InvitationNotFoundError} from '@/modules/errors.server';
import {BadRequest, Ok, ServerError} from '@/modules/responses.server';
import {declineInvitation} from '@/modules/use-cases/index.server';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
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
