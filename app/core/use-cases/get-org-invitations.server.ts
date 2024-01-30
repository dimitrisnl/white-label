import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import {DatabaseError, InternalServerError} from '~/core/lib/errors.server';
import {invitationAuthorizationService} from '~/core/services/invitation-authorization-service.server';

import {MembershipInvitation} from '../domain/membership-invitation.server';
import type {Org} from '../domain/org.server';
import type {User} from '../domain/user.server';

export function getOrgInvitations() {
  function execute(orgId: Org['id'], userId: User['id']) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(get-org-invitations): Getting invitations for org ${orgId} for user ${userId}`
        )
      );

      yield* _(invitationAuthorizationService.canView(userId, orgId));

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
        DatabaseError: () => Effect.fail(new InternalServerError()),
        MembershipInvitationParse: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {execute};
}
