import {db, pool} from '@/database/db.server';
import type {Org, User} from '@/modules/domain/index.server';
import {MembershipInvitation} from '@/modules/domain/index.server';
import {invitationAuthorizationService} from '@/modules/services/index.server';
import {E} from '@/utils/fp';

type Response = E.Either<
  'UnknownError' | 'ForbiddenAction',
  Array<MembershipInvitation.MembershipInvitation>
>;

export function getInvitations() {
  async function execute(
    orgId: Org.Org['id'],
    userId: User.User['id']
  ): Promise<Response> {
    try {
      const hasAccess = await invitationAuthorizationService.canCreate(
        userId,
        orgId
      );
      if (!hasAccess) {
        return E.left('ForbiddenAction');
      }
    } catch {
      return E.left('ForbiddenAction');
    }

    const invitations = [];

    try {
      const invitationRecords = await db
        .select('membership_invitations', {
          org_id: orgId,
        })
        .run(pool);

      for (const invitationRecord of invitationRecords) {
        const toInvitation =
          MembershipInvitation.dbRecordToDomain(invitationRecord);
        if (E.isLeft(toInvitation)) {
          return E.left('UnknownError');
        }
        invitations.push(toInvitation.right);
      }
    } catch (error) {
      return E.left('UnknownError');
    }

    return E.right(invitations);
  }

  return {execute};
}
