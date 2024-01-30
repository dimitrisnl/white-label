import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import type * as Org from '~/core/domain/org.server.ts';
import type * as User from '~/core/domain/user.server.ts';
import * as Uuid from '~/core/domain/uuid.server.ts';
import {
  DatabaseError,
  InternalServerError,
  InvitationNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';
import {invitationAuthorizationService} from '~/core/services/invitation-authorization-service.server.ts';

const validationSchema = Schema.struct({
  invitationId: Uuid.uuidSchema,
});

export type DeleteInvitationProps = Schema.Schema.To<typeof validationSchema>;

export function deleteInvitation() {
  function execute(
    {invitationId}: DeleteInvitationProps,
    orgId: Org.Org['id'],
    userId: User.User['id']
  ) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(delete-invitation): Deleting invitation ${invitationId}`
        )
      );
      yield* _(invitationAuthorizationService.canDelete(userId, orgId));

      const invitationRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db.deletes('membership_invitations', {id: invitationId}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (invitationRecord.length === 0) {
        return yield* _(Effect.fail(new InvitationNotFoundError()));
      }

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
