import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import * as Email from '~/core/domain/email.server';
import * as MembershipInvitation from '~/core/domain/membership-invitation.server.ts';
import * as MembershipRole from '~/core/domain/membership-role.server.ts';
import type * as Org from '~/core/domain/org.server.ts';
import type * as User from '~/core/domain/user.server.ts';
import * as Uuid from '~/core/domain/uuid.server.ts';
import {
  DatabaseError,
  InternalServerError,
  InviteeAlreadyMemberError,
  OrgNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';
import {invitationAuthorizationService} from '~/core/services/invitation-authorization-service.server.ts';

const validationSchema = Schema.struct({
  email: Email.emailSchema,
  role: MembershipRole.membershipRoleSchema,
});

export type CreateInvitationProps = Schema.Schema.To<typeof validationSchema>;

export function createInvitation() {
  function execute(
    {email, role}: CreateInvitationProps,
    orgId: Org.Org['id'],
    userId: User.User['id']
  ) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(create-invitation): Creating invitation for ${email}`
        )
      );

      yield* _(invitationAuthorizationService.canCreate(userId, orgId));

      const invitationId = yield* _(Uuid.generate());

      // Delete any previous invitation
      yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .deletes('membership_invitations', {org_id: orgId, email})
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      const existingMember = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .selectOne(
                'users',
                {email: email},
                {
                  lateral: {
                    membership: db.selectOne('memberships', {
                      org_id: orgId,
                      user_id: db.parent('id'),
                    }),
                  },
                }
              )
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (existingMember?.membership) {
        return yield* _(Effect.fail(new InviteeAlreadyMemberError()));
      }

      const orgRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('orgs', {id: orgId}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!orgRecord) {
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const invitationRecord = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .insert('membership_invitations', {
                id: invitationId,
                role: role,
                email: email,
                org_id: orgId,
              })
              .run(pool),
          catch: () => {
            return new DatabaseError();
          },
        })
      );

      const invitation = yield* _(
        MembershipInvitation.dbRecordToDomain(invitationRecord, {
          slug: orgRecord.slug,
          name: orgRecord.name,
          id: orgRecord.id,
        })
      );

      return invitation;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
        UUIDGenerationError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
