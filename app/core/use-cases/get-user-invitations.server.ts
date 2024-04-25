import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {MembershipInvitation} from '~/core/domain/membership-invitation.server';
import type {User} from '~/core/domain/user.server';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '~/core/lib/errors.server';

export function getUserInvitations({pool, db}: {pool: PgPool; db: DB}) {
  function execute({userId}: {userId: User['id']}) {
    return Effect.gen(function* () {
      yield* Effect.log(
        `(get-user-invitations): Getting invitations for user ${userId}`
      );
      const userRecord = yield* Effect.tryPromise({
        try: () => db.selectOne('users', {id: userId}).run(pool),
        catch: () => new DatabaseError(),
      });

      if (!userRecord) {
        return yield* Effect.fail(new UserNotFoundError());
      }

      const invitationRecords = yield* Effect.tryPromise({
        try: () =>
          db
            .select(
              'membership_invitations',
              {email: userRecord.email.toLowerCase(), status: 'PENDING'},
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

      const invitations = yield* Effect.all(
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
      );

      return {invitations};
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
