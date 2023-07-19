import * as E from 'fp-ts/Either';

import {InviteStatus} from '@/app/constants/InviteStatus';

import MembershipInvitation from '../../models/MembershipInvitation';

type Response = E.Either<'InvitationNotFound', null>;

export function declineInvitation() {
  async function execute(invitationId: string): Promise<Response> {
    const invitation = await MembershipInvitation.query()
      .where('id', invitationId)
      .where('status', InviteStatus.PENDING)
      .first();

    if (!invitation) {
      return E.left('InvitationNotFound');
    }

    invitation.status = InviteStatus.DECLINED;
    await invitation.save();

    return E.right(null);
  }

  return {execute};
}
