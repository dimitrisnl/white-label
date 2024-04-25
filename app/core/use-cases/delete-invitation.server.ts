import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import type {Org} from '~/core/domain/org.server';
import type {User} from '~/core/domain/user.server';
import {uuidSchema} from '~/core/domain/uuid.server';
import {
  DatabaseError,
  InternalServerError,
  InvitationNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';
import {invitationAuthorizationService} from '~/core/services/invitation-authorization-service.server.ts';

const validationSchema = Schema.Struct({
  invitationId: uuidSchema,
});

export type DeleteInvitationProps = Schema.Schema.Type<typeof validationSchema>;

export function deleteInvitation({pool, db}: {pool: PgPool; db: DB}) {
  function execute({
    props: {invitationId},
    userId,
    orgId,
  }: {
    props: DeleteInvitationProps;
    userId: User['id'];
    orgId: Org['id'];
  }) {
    return Effect.gen(function* () {
      yield* Effect.log(
        `(delete-invitation): Deleting invitation ${invitationId} by user ${userId} in org ${orgId}`
      );
      yield* invitationAuthorizationService({
        pool,
        db,
      }).canDelete({userId, orgId, invitationId});

      const invitationRecord = yield* Effect.tryPromise({
        try: () =>
          db.deletes('membership_invitations', {id: invitationId}).run(pool),
        catch: () => new DatabaseError(),
      });

      if (invitationRecord.length === 0) {
        return yield* Effect.fail(new InvitationNotFoundError());
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

  return {
    execute,
    validate,
  };
}
