import type {LoaderArgs, Request} from '@remix-run/node';
import {redirect} from '@remix-run/node';

import {respond} from '@/lib/respond';
import {requireToken} from '@/lib/session';

import {getMembershipInvitations, getOrg} from './requests';

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

  const invitations = await getMembershipInvitations({
    token,
    orgId,
  }).then(({data}) => {
    return data.membershipInvitations;
  });

  const {users, org} = await getOrg({
    token,
    orgId,
  }).then(({data}) => {
    return {
      users: data.users,
      org: data.org,
    };
  });

  return respond.ok.data({org, users, invitations});
}

export type GetOrgLoader = typeof loader;
