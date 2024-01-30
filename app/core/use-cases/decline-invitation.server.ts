import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import * as InviteStatus from '~/core/domain/invite-status.server.ts';
import * as Uuid from '~/core/domain/uuid.server.ts';
import {
  DatabaseError,
  InternalServerError,
  InvitationNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  invitationId: Uuid.uuidSchema,
});

export type DeclineInvitationProps = Schema.Schema.To<typeof validationSchema>;

export function declineInvitation() {
  function execute({invitationId}: DeclineInvitationProps) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(decline-invitation): Declining invitation ${invitationId}`
        )
      );
      const invitationRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .selectOne('membership_invitations', {
                id: invitationId,
                status: InviteStatus.PENDING,
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
                {status: InviteStatus.DECLINED},
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
