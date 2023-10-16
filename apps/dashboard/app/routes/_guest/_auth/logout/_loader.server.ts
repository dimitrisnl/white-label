import * as Effect from 'effect/Effect';

import {logout} from '@/modules/session.server';
import {LoaderArgs, withLoader} from '@/modules/with-loader.server';

export const loader = withLoader(
  Effect.gen(function* (_) {
    yield* _(Effect.log('Loader(_guest/_auth/logout): Init'));
    const {request} = yield* _(LoaderArgs);

    return yield* _(logout(request));
  })
);
