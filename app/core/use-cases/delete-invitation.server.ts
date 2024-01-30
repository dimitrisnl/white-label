import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import {
  DatabaseError,
  InternalServerError,
  InvitationNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';
import {invitationAuthorizationService} from '~/core/services/invitation-authorization-service.server.ts';

import type {Org} from '../domain/org.server';
import type {User} from '../domain/user.server';
import {uuidSchema} from '../domain/uuid.server';

const validationSchema = Schema.struct({
  invitationId: uuidSchema,
});

export type DeleteInvitationProps = Schema.Schema.To<typeof validationSchema>;

export function deleteInvitation() {
  function execute(
    {invitationId}: DeleteInvitationProps,
    orgId: Org['id'],
    userId: User['id']
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
