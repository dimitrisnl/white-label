import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {DECLINED, PENDING} from '~/core/domain/invite-status.server';
import {uuidSchema} from '~/core/domain/uuid.server';
import {
  DatabaseError,
  InternalServerError,
  InvitationNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.Struct({
  invitationId: uuidSchema,
});

export type DeclineInvitationProps = Schema.Schema.Type<
  typeof validationSchema
>;

export function declineInvitation({pool, db}: {pool: PgPool; db: DB}) {
  function execute({invitationId}: DeclineInvitationProps) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`(decline-invitation): Declining invitation ${invitationId}`)
      );
      const invitationRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .selectOne('membership_invitations', {
                id: invitationId,
                status: PENDING,
              })
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!invitationRecord) {
        return yield* _(Effect.fail(new InvitationNotFoundError()));
      }

      const records = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .update(
                'membership_invitations',
                {status: DECLINED, updated_at: db.sql`now()`},
                {id: invitationId}
              )
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (records.length === 0 || !records[0]) {
        return new DatabaseError();
      }

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {execute, validate};
}
