import {db, pool} from '@/database/db.server';
import type {MembershipRole, Org, User} from '@/modules/domain/index.server';
import {MembershipInvitation, Uuid} from '@/modules/domain/index.server';
import {invitationAuthorizationService} from '@/modules/services/index.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

interface Props {
  email: string;
  role: MembershipRole.MembershipRole;
}

type Response = E.Either<
  'ForbiddenAction' | 'InviteeExists' | 'UnknownError',
  MembershipInvitation.MembershipInvitation
>;

export function createInvitation() {
  async function execute(
    props: Props,
    orgId: Org.Org['id'],
    userId: User.User['id']
  ): Promise<Response> {
    const {email, role} = props;
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

    // todo: ensure the user doesn't already exist in that org
    try {
      const invitationRecord = await db
        .insert('membership_invitations', {
          id: Uuid.generate(),
          role: role,
          email,
          org_id: orgId,
        })
        .run(pool);
      const toInvitation =
        MembershipInvitation.dbRecordToDomain(invitationRecord);

      if (E.isLeft(toInvitation)) {
        return E.left('UnknownError');
      }

      const invitation = toInvitation.right;

      // todo: send invitation email
      // await sendInvitationEmailEvent(invitation, org);

      return E.right(invitation);
    } catch (error) {
      // todo: Unique constraint violation
      // if (error.code === UNIQUE_CONSTRAINT_VIOLATION) {
      //   return E.left('InviteeExists');
      // }
      return E.left('UnknownError');
    }
  }

  return {
    execute,
    validate,
  };
}
