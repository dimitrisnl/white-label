import * as Effect from 'effect/Effect';

import {logout} from '~/modules/session.server.ts';
import {ActionArgs, withAction} from '~/modules/with-action.server.ts';

export const action = withAction(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Action(_guest/_auth/logout): Init'));
    const {request} = yield* _(ActionArgs);

    return yield* _(logout(request));
  })
);
