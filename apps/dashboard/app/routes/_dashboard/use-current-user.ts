import {useTypedRouteLoaderData} from 'remix-typedjson';

import type {CurrentUserLoaderData} from './_loader.server.ts';

export function useCurrentUserData() {
  const {data: currentUser} = useTypedRouteLoaderData<CurrentUserLoaderData>(
    'routes/_dashboard/_layout'
  )!;

  return {currentUser};
}
