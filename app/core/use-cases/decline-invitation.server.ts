import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import * as InviteStatus from '~/core/domain/invite-status.server.ts';
import type * as MembershipInvitation from '~/core/domain/membership-invitation.server.ts';
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
function selectInvitationRecord(
  invitationId: MembershipInvitation.MembershipInvitation['id']
) {
  return Effect.tryPromise({
    try: () =>
      db
        .selectOne('membership_invitations', {
          id: invitationId,
          status: InviteStatus.PENDING,
        })
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

function updateMembershipInvitationRecord({
  id,
  status,
}: {
  id: MembershipInvitation.MembershipInvitation['id'];
  status: MembershipInvitation.MembershipInvitation['status'];
}) {
  return Effect.tryPromise({
    try: () => db.update('membership_invitations', {status}, {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function declineInvitation() {
  function execute(props: DeclineInvitationProps) {
    const {invitationId} = props;
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(decline-invitation): Declining invitation ${invitationId}`
        )
      );
      const invitationRecord = yield* _(selectInvitationRecord(invitationId));

      if (!invitationRecord) {
        return yield* _(Effect.fail(new InvitationNotFoundError()));
      }

      yield* _(
        updateMembershipInvitationRecord({
          id: invitationId,
          status: InviteStatus.DECLINED,
        })
      );

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
