import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '~/core/lib/errors.server';

import {MembershipInvitation} from '../domain/membership-invitation.server';
import type {User} from '../domain/user.server';

export function getUserInvitations() {
  function execute({userId}: {userId: User['id']}) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `(get-user-invitations): Getting invitations for user ${userId}`
        )
      );
      const userRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('users', {id: userId}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const invitationRecords = yield* _(
        Effect.tryPromise({
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
