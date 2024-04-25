import * as Effect from 'effect/Effect';

import {logout} from '~/core/lib/session.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* () {
    const {request} = yield* LoaderArgs;

    return yield* logout(request);
  })
);
