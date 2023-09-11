import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server';
import type {User} from '@/modules/domain/index.server';
import {
  InviteStatus,
  MembershipInvitation,
} from '@/modules/domain/index.server';

import {
  DatabaseError,
  InternalServerError,
  InvitationNotFoundError,
} from '../../errors.server';
import type {AcceptInvitationProps} from './validation.server';
import {validate} from './validation.server';

function fetchInvitation(invitationId: string) {
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

function updateInvitation(invitationId: string) {
  return Effect.tryPromise({
    try: () =>
      db
        .update(
          'membership_invitations',
          {status: InviteStatus.ACCEPTED},
          {id: invitationId}
        )
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

function updateMembership(
  invitation: MembershipInvitation.MembershipInvitation,
  userId: User.User['id']
) {
  return Effect.tryPromise({
    try: () =>
      db
        .update(
          'memberships',
          {user_id: userId},
          {role: invitation.role, org_id: invitation.orgId}
        )
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

export function acceptInvitation() {
  function execute(props: AcceptInvitationProps, userId: User.User['id']) {
    const {invitationId} = props;
    return Effect.gen(function* (_) {
      const invitationRecord = yield* _(fetchInvitation(invitationId));

      if (!invitationRecord) {
        return yield* _(Effect.fail(new InvitationNotFoundError()));
      }

      const membershipInvitation = yield* _(
        MembershipInvitation.dbRecordToDomain(invitationRecord)
      );

      yield* _(updateInvitation(invitationId));
      yield* _(updateMembership(membershipInvitation, userId));

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
