import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import {
  DatabaseError,
  InternalServerError,
  InvitationNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

import {DECLINED, PENDING} from '../domain/invite-status.server';
import {uuidSchema} from '../domain/uuid.server';

const validationSchema = Schema.struct({
  invitationId: uuidSchema,
});

export type DeclineInvitationProps = Schema.Schema.To<typeof validationSchema>;

export function declineInvitation() {
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
        DatabaseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {execute, validate};
}
