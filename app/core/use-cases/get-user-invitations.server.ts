import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import * as MembershipInvitation from '~/core/domain/membership-invitation.server';
import * as User from '~/core/domain/user.server.ts';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '~/core/lib/errors.server';

export function getUserInvitations() {
  function execute(userId: User.User['id']) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(get-user-invitations): Getting invitations for user ${userId}`
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

      const user = yield* _(User.dbRecordToDomain(userRecord));

      const invitationRecords = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .select(
                'membership_invitations',
                {email: user.email.toLowerCase(), status: 'PENDING'},
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
            MembershipInvitation.dbRecordToDomain(invitationRecord, {
              name: invitationRecord.org.name,
              id: invitationRecord.org_id,
              slug: invitationRecord.org.slug,
            })
          ),
          {concurrency: 'unbounded'}
        )
      );

      return {invitations};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {execute};
}
