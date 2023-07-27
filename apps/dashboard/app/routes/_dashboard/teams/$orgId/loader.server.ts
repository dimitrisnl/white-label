import type {LoaderArgs, Request} from '@remix-run/node';
import {redirect} from '@remix-run/node';

import {respond} from '@/lib/respond';
import {requireToken} from '@/lib/session';

import {getOrg} from './requests';

export async function loader({
  request,
  params,
}: {
  request: Request;
  params: LoaderArgs['params'];
}) {
  if (!params.orgId) {
    return redirect('/');
  }

  const {orgId} = params;
  const token = await requireToken(request);

  return await getOrg({
    token,
    orgId,
  }).then(({data}) => {
    return respond.ok.data({
      org: data.org,
      users: data.users,
    });
  });
}

export type GetOrgLoader = typeof loader;
