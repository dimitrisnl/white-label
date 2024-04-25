import * as Effect from 'effect/Effect';

import {logout} from '~/core/lib/session.server';
import {ActionArgs, withAction} from '~/core/lib/with-action.server';

export const action = withAction(
  Effect.gen(function* () {
    const {request} = yield* ActionArgs;

    return yield* logout(request);
  })
);
