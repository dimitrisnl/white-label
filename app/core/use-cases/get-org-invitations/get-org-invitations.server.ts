import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import * as MembershipInvitation from '~/core/domain/membership-invitation.server';
import type * as Org from '~/core/domain/org.server.ts';
import type * as User from '~/core/domain/user.server.ts';
import {DatabaseError, InternalServerError} from '~/core/lib/errors.server';
import {invitationAuthorizationService} from '~/core/services/invitation-authorization-service.server';

function getInvitationRecords(orgId: Org.Org['id']) {
  return Effect.tryPromise({
    try: () =>
      db
        .select(
          'membership_invitations',
          {
            org_id: orgId,
          },
          {
            lateral: {
              org: db.selectExactlyOne(
                'orgs',
                {id: orgId},
                {columns: ['name', 'slug']}
              ),
            },
          }
        )
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

export function getOrgInvitations() {
  function execute(orgId: Org.Org['id'], userId: User.User['id']) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(get-org-invitations): Getting invitations for org ${orgId} for user ${userId}`
        )
      );
      yield* _(invitationAuthorizationService.canView(userId, orgId));
      const invitationRecords = yield* _(getInvitationRecords(orgId));

      const invitations = yield* _(
        Effect.all(
          invitationRecords.map((invitationRecord) =>
            MembershipInvitation.dbRecordToDomain(invitationRecord, {
              name: invitationRecord.org.name,
              id: invitationRecord.org_id,
              slug: invitationRecord.org.slug,
            })
          ),
          {concurrency: 'unbounded'}
        )
      );

      return invitations;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {execute};
}
