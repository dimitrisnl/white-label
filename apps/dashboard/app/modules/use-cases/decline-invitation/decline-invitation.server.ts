import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server';
import type {MembershipInvitation} from '@/modules/domain/index.server';
import {InviteStatus} from '@/modules/domain/index.server';
import {
  DatabaseError,
  InternalServerError,
  InvitationNotFoundError,
} from '@/modules/errors.server';

import type {DeclineInvitationProps} from './validation.server';
import {validate} from './validation.server';

function selectInvitationRecord(
  invitationId: MembershipInvitation.MembershipInvitation['id']
) {
  return Effect.tryPromise({
    try: () =>
      db
        .selectOne('membership_invitations', {
          id: invitationId,
          status: InviteStatus.PENDING,
        })
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

function updateMembershipInvitationRecord({
  id,
  status,
}: {
  id: MembershipInvitation.MembershipInvitation['id'];
  status: MembershipInvitation.MembershipInvitation['status'];
}) {
  return Effect.tryPromise({
    try: () => db.update('membership_invitations', {status}, {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function declineInvitation() {
  function execute(props: DeclineInvitationProps) {
    const {invitationId} = props;
    return Effect.gen(function* (_) {
      const invitationRecord = yield* _(selectInvitationRecord(invitationId));

      if (!invitationRecord) {
        return yield* _(Effect.fail(new InvitationNotFoundError()));
      }

      yield* _(
        updateMembershipInvitationRecord({
          id: invitationId,
          status: InviteStatus.DECLINED as InviteStatus.InviteStatus, // todo: fix
        })
      );

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {execute, validate};
}