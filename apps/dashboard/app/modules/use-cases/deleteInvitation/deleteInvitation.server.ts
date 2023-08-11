import {db, pool} from '@/database/db.server';
import type {Org, User} from '@/modules/domain/index.server';
import {invitationAuthorizationService} from '@/modules/services/index.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

type Response = E.Either<'InvitationNotFound' | 'ForbiddenAction', null>;

interface Props {
  invitationId: string;
}

export function deleteInvitation() {
  async function execute(
    props: Props,
    orgId: Org.Org['id'],
    userId: User.User['id']
  ): Promise<Response> {
    const {invitationId} = props;
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

    const invitationRecord = await db
      .deletes('membership_invitations', {
        id: invitationId,
      })
      .run(pool);

    if (invitationRecord.length === 0) {
      return E.left('InvitationNotFound');
    }

    return E.right(null);
  }

  return {
    execute,
    validate,
  };
}
