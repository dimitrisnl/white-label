import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import * as InviteStatus from '~/core/domain/invite-status.server.ts';
import * as MembershipInvitation from '~/core/domain/membership-invitation.server.ts';
import type * as User from '~/core/domain/user.server.ts';
import {
  DatabaseError,
  InternalServerError,
  InvitationNotFoundError,
} from '~/core/lib/errors.server.ts';

import type {AcceptInvitationProps} from './validation.server.ts';
import {validate} from './validation.server.ts';

function fetchInvitation(invitationId: string) {
  return Effect.tryPromise({
    try: () =>
      db
        .selectOne(
          'membership_invitations',
          {
            id: invitationId,
            status: InviteStatus.PENDING,
          },
          {
            lateral: {
              org: db.selectExactlyOne(
                'orgs',
                {id: db.parent('org_id')},
                {columns: ['name', 'slug']}
              ),
            },
          }
        )
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
        .insert('memberships', {
          org_id: invitation.org.id,
          user_id: userId,
          role: invitation.role,
        })
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

export function acceptInvitation() {
  function execute(props: AcceptInvitationProps, userId: User.User['id']) {
    const {invitationId} = props;
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(accept-invitation): Accepting invitation ${invitationId}`
        )
      );

      const invitationRecord = yield* _(fetchInvitation(invitationId));

      if (!invitationRecord) {
        return yield* _(Effect.fail(new InvitationNotFoundError()));
      }

      const membershipInvitation = yield* _(
        MembershipInvitation.dbRecordToDomain(invitationRecord, {
          slug: invitationRecord.org.slug,
          name: invitationRecord.org.name,
          id: invitationRecord.org_id,
        })
      );

      yield* _(updateInvitation(invitationId));
      yield* _(updateMembership(membershipInvitation, userId));

      return membershipInvitation;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {execute, validate};
}
