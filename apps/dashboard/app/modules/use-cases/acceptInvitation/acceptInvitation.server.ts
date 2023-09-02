import {db, pool} from '@/database/db.server';
import type {User} from '@/modules/domain/index.server';
import {
  InviteStatus,
  MembershipInvitation,
} from '@/modules/domain/index.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

type Response = E.Either<'InvitationNotFound' | 'UnknownError', null>;

interface Props {
  invitationId: string;
}

export function acceptInvitation() {
  async function execute(
    props: Props,
    userId: User.User['id']
  ): Promise<Response> {
    const invitationRecord = await db
      .selectOne('membership_invitations', {
        id: props.invitationId,
        status: InviteStatus.PENDING,
      })
      .run(pool);

    if (!invitationRecord) {
      return E.left('InvitationNotFound');
    }

    const toInvitation =
      MembershipInvitation.dbRecordToDomain(invitationRecord);

    if (E.isLeft(toInvitation)) {
      return E.left('UnknownError');
    }

    const invitation = toInvitation.right;

    // todo maybe merge these to 1 call
    await db
      .update(
        'membership_invitations',
        {status: InviteStatus.ACCEPTED},
        {id: props.invitationId}
      )
      .run(pool);

    await db
      .update(
        'memberships',
        {user_id: userId, org_id: invitation.orgId},
        {role: invitation.role}
      )
      .run(pool);

    return E.right(null);
  }

  return {execute, validate};
}
