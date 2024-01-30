import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import * as InviteStatus from '~/core/domain/invite-status.server.ts';
import * as Org from '~/core/domain/org.server.ts';
import type * as User from '~/core/domain/user.server.ts';
import {uuidSchema} from '~/core/domain/uuid.server.ts';
import {
  DatabaseError,
  InternalServerError,
  InvitationNotFoundError,
  OrgNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  invitationId: uuidSchema,
});

export type AcceptInvitationProps = Schema.Schema.To<typeof validationSchema>;

export function acceptInvitation() {
  function execute(
    {invitationId}: AcceptInvitationProps,
    userId: User.User['id']
  ) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(accept-invitation): Accepting invitation ${invitationId}`
        )
      );

      const records = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .deletes('membership_invitations', {
                status: InviteStatus.PENDING,
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
        yield* _(
          Effect.logError(`
          Use-case(accept-invitation): Org ${org_id} not found`)
        );
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const org = yield* _(Org.dbRecordToDomain(orgRecord));

      return {org};
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {execute, validate};
}
