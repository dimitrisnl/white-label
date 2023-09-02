import type {LoaderArgs, Request} from '@remix-run/node';
import {redirect} from '@remix-run/node';

import {Org} from '@/modules/domain/index.server';
import {requireUser} from '@/modules/session.server';
import {getInvitations, getOrg} from '@/modules/use-cases/index.server';
import {E} from '@/utils/fp';
import {respond} from '@/utils/respond.server';

export async function loader({
  request,
  params,
}: {
  request: Request;
  params: LoaderArgs['params'];
}) {
  if (!params.orgId) {
    throw redirect('/');
  }
  const orgIdParsing = Org.parseId(params.orgId);

  if (E.isLeft(orgIdParsing)) {
    throw redirect('/');
  }

  const orgId = orgIdParsing.right;

  const {currentUser} = await requireUser(request);

  const invitationsResponse = await getInvitations().execute(
    orgId,
    currentUser.user.id
  );

  if (E.isLeft(invitationsResponse)) {
    return respond.fail.unknown();
  }

  const invitations = invitationsResponse.right;

  const orgResponse = await getOrg().execute(orgId);

  if (E.isLeft(orgResponse)) {
    return respond.fail.unknown();
  }

  const {users, org} = orgResponse.right;

  return respond.ok.data({org, users, invitations, currentUser});
}

export type GetOrgLoader = typeof loader;
