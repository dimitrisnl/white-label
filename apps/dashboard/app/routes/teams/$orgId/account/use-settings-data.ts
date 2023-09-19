import {useTypedRouteLoaderData} from 'remix-typedjson';

import {SettingsLoaderData} from './_loader.server';

export function useSettingsData() {
  const {data: currentUser} = useTypedRouteLoaderData<SettingsLoaderData>(
    'routes/teams/$orgId/account/_route'
  )!;

  return {currentUser};
}
