import * as Effect from 'effect/Effect';

import {logout} from '~/core/lib/session.server';
import {LoaderArgs, withLoader} from '~/core/lib/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    const {request} = yield* _(LoaderArgs);

    return yield* _(logout(request));
  })
);
