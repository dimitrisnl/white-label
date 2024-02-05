import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {MembershipInvitation} from '~/core/domain/membership-invitation.server';
import type {Org} from '~/core/domain/org.server';
import type {User} from '~/core/domain/user.server';
import {DatabaseError, InternalServerError} from '~/core/lib/errors.server';
import {invitationAuthorizationService} from '~/core/services/invitation-authorization-service.server';

export function getOrgInvitations({pool, db}: {pool: PgPool; db: DB}) {
  function execute({orgId, userId}: {orgId: Org['id']; userId: User['id']}) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `(get-org-invitations): Getting invitations for org ${orgId} for user ${userId}`
        )
      );

      yield* _(
        invitationAuthorizationService({pool, db}).canViewAll({userId, orgId})
      );

      const invitationRecords = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .select(
                'membership_invitations',
                {org_id: orgId},
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
        })
      );

      const invitations = yield* _(
        Effect.all(
          invitationRecords.map((invitationRecord) =>
            MembershipInvitation.fromRecord({
              record: invitationRecord,
              org: {
                name: invitationRecord.org.name,
                id: invitationRecord.org_id,
                slug: invitationRecord.org.slug,
              },
            })
          ),
          {concurrency: 'unbounded'}
        )
      );

      return invitations;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        MembershipInvitationParse: () =>
          Effect.fail(
            new InternalServerError({
              reason: 'Error parsing membership invitation',
            })
          ),
      })
    );
  }

  return {execute};
}
