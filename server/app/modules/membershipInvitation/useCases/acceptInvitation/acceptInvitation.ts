import * as E from 'fp-ts/Either';

import {InviteStatus} from '@/app/constants/InviteStatus';
import User from '@/app/modules/user/models/User';

import MembershipInvitation from '../../models/MembershipInvitation';

type Response = E.Either<'InvitationNotFound', null>;

export function acceptInvitation() {
  async function execute(invitationId: string, user: User): Promise<Response> {
    const invitation = await MembershipInvitation.query()
      .where('id', invitationId)
      .where('status', InviteStatus.PENDING)
      .first();

    if (!invitation) {
      return E.left('InvitationNotFound');
    }

    invitation.status = InviteStatus.ACCEPTED;
    await invitation.save();

    await user.related('orgs').attach({
      [invitation.orgId]: {
        role: invitation.role,
      },
    });

    return E.right(null);
  }

  return {execute};
}
