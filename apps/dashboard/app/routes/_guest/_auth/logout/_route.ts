import * as Effect from 'effect/Effect';

import {logout} from '@/modules/session.server';
import {ActionArgs, withAction} from '@/modules/with-action.server';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server';

export const action = withAction(
  Effect.gen(function* (_) {
    const {request} = yield* _(ActionArgs);

    return yield* _(logout(request));
  })
);

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request} = yield* _(LoaderArgs);

    return yield* _(logout(request));
  })
);
