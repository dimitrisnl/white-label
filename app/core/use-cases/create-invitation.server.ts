import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import {
  DatabaseError,
  InternalServerError,
  InviteeAlreadyMemberError,
  OrgNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';
import {invitationAuthorizationService} from '~/core/services/invitation-authorization-service.server.ts';

import {emailSchema} from '../domain/email.server';
import {MembershipInvitation} from '../domain/membership-invitation.server';
import {membershipRoleSchema} from '../domain/membership-role.server';
import type {Org} from '../domain/org.server';
import type {User} from '../domain/user.server';
import {generateUUID} from '../domain/uuid.server';

const validationSchema = Schema.struct({
  email: emailSchema,
  role: membershipRoleSchema,
});

export type CreateInvitationProps = Schema.Schema.To<typeof validationSchema>;

export function createInvitation() {
  function execute({
    props: {email, role},
    userId,
    orgId,
  }: {
    props: CreateInvitationProps;
    userId: User['id'];
    orgId: Org['id'];
  }) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`(create-invitation): Creating invitation for ${email}`)
      );

      yield* _(invitationAuthorizationService.canCreate({userId, orgId}));

      const invitationId = yield* _(generateUUID());

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
        return yield* _(
          Effect.fail(
            new InviteeAlreadyMemberError({
              inviterId: userId,
              orgId,
              inviteeEmail: existingMember.email,
              inviteeId: existingMember.id,
            })
          )
        );
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
        MembershipInvitation.fromRecord({
          record: invitationRecord,
          org: {
            slug: orgRecord.slug,
            name: orgRecord.name,
            id: orgRecord.id,
          },
        })
      );

      return invitation;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        MembershipInvitationParse: () =>
          Effect.fail(
            new InternalServerError({
              reason: 'Membership invitation parse error',
            })
          ),
        UUIDGenerationError: () =>
          Effect.fail(
            new InternalServerError({reason: 'UUID generation error'})
          ),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
