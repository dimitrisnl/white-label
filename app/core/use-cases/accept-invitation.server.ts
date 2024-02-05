import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {uuidSchema} from '~/core/domain/uuid.server.ts';
import {
  DatabaseError,
  InternalServerError,
  InvitationNotFoundError,
  OrgNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

import type {DB, PgPool} from '../db/types';
import {PENDING} from '../domain/invite-status.server';
import {Org} from '../domain/org.server';
import type {User} from '../domain/user.server';

const validationSchema = Schema.struct({
  invitationId: uuidSchema,
});

export type AcceptInvitationProps = Schema.Schema.To<typeof validationSchema>;

export function acceptInvitation({pool, db}: {pool: PgPool; db: DB}) {
  function execute({
    props: {invitationId},
    userId,
  }: {
    props: AcceptInvitationProps;
    userId: User['id'];
  }) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`(accept-invitation): Accepting invitation ${invitationId}`)
      );

      const records = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .deletes('membership_invitations', {
                status: PENDING,
                id: invitationId,
              })
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (records.length === 0 || !records[0]) {
        return yield* _(Effect.fail(new InvitationNotFoundError()));
      }

      const {org_id, role} = records[0];

      const membershipRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .insert('memberships', {org_id, user_id: userId, role: role})
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      const orgRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db.selectOne('orgs', {id: membershipRecord.org_id}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!orgRecord) {
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const org = yield* _(Org.fromRecord(orgRecord));

      return {org};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(
            new InternalServerError({
              reason: 'Database error',
            })
          ),
        OrgParseError: () =>
          Effect.fail(
            new InternalServerError({
              reason: 'Error parsing org record',
            })
          ),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {execute, validate};
}
