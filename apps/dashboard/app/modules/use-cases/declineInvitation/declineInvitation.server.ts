import {db, pool} from '@/database/db.server';
import {InviteStatus} from '@/modules/domain/index.server';
import {E} from '@/utils/fp';

import {validate} from './validation.server';

type Response = E.Either<'InvitationNotFound' | 'UnknownError', null>;

interface Props {
  invitationId: string;
}

export function declineInvitation() {
  async function execute(props: Props): Promise<Response> {
    const {invitationId} = props;

    const invitationRecord = await db
      .selectOne('membership_invitations', {
        id: invitationId,
        status: InviteStatus.PENDING,
      })
      .run(pool);

    if (!invitationRecord) {
      return E.left('InvitationNotFound');
    }

    // todo maybe merge these to 1 call
    await db
      .update(
        'membership_invitations',
        {status: InviteStatus.DECLINED},
        {id: invitationId}
      )
      .run(pool);

    return E.right(null);
  }

  return {execute, validate};
}
