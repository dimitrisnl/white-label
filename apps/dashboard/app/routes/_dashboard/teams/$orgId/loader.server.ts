import type {Request, LoaderArgs} from '@remix-run/node';
import {json} from '@remix-run/node';

import {requireToken} from '@/lib/session';

import {getOrg} from './requests';

export async function loader({
  request,
  params,
}: {
  request: Request;
  params: LoaderArgs['params'];
}) {
  const orgId = params.orgId!;
  const token = await requireToken(request);

  return await getOrg({
    token,
    orgId,
  }).then(({data}) => {
    return json({
      org: data.org,
      users: data.users,
    });
  });
}
