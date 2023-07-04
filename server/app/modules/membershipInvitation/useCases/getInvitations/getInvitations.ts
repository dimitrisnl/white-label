import * as E from 'fp-ts/Either';

import Org from '@/app/modules/org/models/Org';

import MembershipInvitation from '../../models/MembershipInvitation';

type Response = E.Either<never, Array<MembershipInvitation>>;

export function getInvitations() {
  async function execute(org: Org): Promise<Response> {
    const invitations = await org.related('membershipInvitations').query();

    return E.right(invitations);
  }

  return {execute};
}
