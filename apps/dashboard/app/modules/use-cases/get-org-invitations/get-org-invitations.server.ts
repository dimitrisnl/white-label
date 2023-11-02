import * as Effect from 'effect/Effect';

import {db, pool} from '~/database/db.server.ts';
import type {Org, User} from '~/modules/domain/index.server.ts';
import {MembershipInvitation} from '~/modules/domain/index.server.ts';
import {DatabaseError, InternalServerError} from '~/modules/errors.server.ts';
import {invitationAuthorizationService} from '~/modules/services/index.server.ts';

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
