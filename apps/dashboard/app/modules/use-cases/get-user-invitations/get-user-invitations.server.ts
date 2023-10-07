import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server';
import {MembershipInvitation, User} from '@/modules/domain/index.server';
import {
  DatabaseError,
  InternalServerError,
  UserNotFoundError,
} from '@/modules/errors.server';

function selectUserRecord(id: User.User['id']) {
  return Effect.tryPromise({
    try: () => db.selectOne('users', {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function getInvitationRecords(email: User.User['email']) {
  return Effect.tryPromise({
    try: () =>
      db
        .select(
          'membership_invitations',
          {
            email: email,
            status: 'PENDING',
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

export function getUserInvitations() {
  function execute(userId: User.User['id']) {
    return Effect.gen(function* (_) {
      const userRecord = yield* _(selectUserRecord(userId));

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const user = yield* _(User.dbRecordToDomain(userRecord));

      const invitationRecords = yield* _(getInvitationRecords(user.email));

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
