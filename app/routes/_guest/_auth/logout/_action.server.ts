import * as Effect from 'effect/Effect';

import {logout} from '~/core/lib/session.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request} = yield* _(ActionArgs);

    return yield* _(logout(request));
  })
);
