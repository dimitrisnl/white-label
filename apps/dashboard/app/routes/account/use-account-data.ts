import {useTypedRouteLoaderData} from 'remix-typedjson';

import {AccountLoaderData} from './_loader.server.ts';

export function useAccountData() {
  const {data: currentUser} = useTypedRouteLoaderData<AccountLoaderData>(
    'routes/account/_layout'
  )!;

  return {currentUser};
}
