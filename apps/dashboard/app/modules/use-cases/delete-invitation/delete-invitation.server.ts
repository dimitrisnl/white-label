import * as Effect from 'effect/Effect';

import {db, pool} from '~/database/db.server.ts';
import type {
  MembershipInvitation,
  Org,
  User,
} from '~/modules/domain/index.server.ts';
import {
  DatabaseError,
  InternalServerError,
  InvitationNotFoundError,
} from '~/modules/errors.server.ts';
import {invitationAuthorizationService} from '~/modules/services/index.server.ts';

import type {DeleteInvitationProps} from './validation.server.ts';
import {validate} from './validation.server.ts';

function deleteInvitationRecord(
  invitationId: MembershipInvitation.MembershipInvitation['id']
) {
  return Effect.tryPromise({
    try: () =>
      db
        .deletes('membership_invitations', {
          id: invitationId,
        })
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

export function deleteInvitation() {
  function execute(
    props: DeleteInvitationProps,
    orgId: Org.Org['id'],
    userId: User.User['id']
  ) {
    const {invitationId} = props;
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(delete-invitation): Deleting invitation ${invitationId}`
        )
      );
      yield* _(invitationAuthorizationService.canDelete(userId, orgId));

      const invitationRecord = yield* _(deleteInvitationRecord(invitationId));

      if (invitationRecord.length === 0) {
        return yield* _(Effect.fail(new InvitationNotFoundError()));
      }

      return null;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {
    execute,
    validate,
  };
}
