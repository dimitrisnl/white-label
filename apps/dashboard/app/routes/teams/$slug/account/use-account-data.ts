import {useTypedRouteLoaderData} from 'remix-typedjson';

import {AccountLoaderData} from './_loader.server';

export function useAccountData() {
  const {data: currentUser} = useTypedRouteLoaderData<AccountLoaderData>(
    'routes/teams/$slug/account/_layout'
  )!;

  return {currentUser};
}
