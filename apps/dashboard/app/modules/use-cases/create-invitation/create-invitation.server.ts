import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server.ts';
import type {MembershipRole, Org, User} from '@/modules/domain/index.server.ts';
import {MembershipInvitation, Uuid} from '@/modules/domain/index.server.ts';
import {invitationAuthorizationService} from '@/modules/services/index.server.ts';

import {
  DatabaseError,
  InternalServerError,
  InviteeAlreadyMemberError,
  OrgNotFoundError,
} from '../../errors.server.ts';
import type {CreateInvitationProps} from './validation.server.ts';
import {validate} from './validation.server.ts';

function insertInvitation({
  role,
  email,
  orgId,
  invitationId,
}: {
  role: MembershipRole.MembershipRole;
  email: string;
  orgId: Org.Org['id'];
  invitationId: Uuid.Uuid;
}) {
  return Effect.tryPromise({
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
  });
}

function getOrgRecord(id: Org.Org['id']) {
  return Effect.tryPromise({
    try: () => db.selectOne('orgs', {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function deleteInvitationRecord({
  email,
  orgId,
}: {
  email: string;
  orgId: Org.Org['id'];
}) {
  return Effect.tryPromise({
    try: () =>
      db.deletes('membership_invitations', {org_id: orgId, email}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function findExistingMember({
  email,
  orgId,
}: {
  email: string;
  orgId: Org.Org['id'];
}) {
  return Effect.tryPromise({
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
  });
}

export function createInvitation() {
  function execute(
    props: CreateInvitationProps,
    orgId: Org.Org['id'],
    userId: User.User['id']
  ) {
    const {email, role} = props;
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(
          `Use-case(create-invitation): Creating invitation for ${email}`
        )
      );
      yield* _(invitationAuthorizationService.canCreate(userId, orgId));

      const invitationId = yield* _(Uuid.generate());

      // Delete any previous invitation
      yield* _(deleteInvitationRecord({email, orgId}));

      const existingMember = yield* _(findExistingMember({orgId, email}));

      if (existingMember && existingMember.membership) {
        return yield* _(Effect.fail(new InviteeAlreadyMemberError()));
      }

      // todo: avoid doing this extra query, select org fields during insert
      const orgRecord = yield* _(getOrgRecord(orgId));

      if (!orgRecord) {
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const invitationRecord = yield* _(
        insertInvitation({email, role, orgId, invitationId})
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

  return {
    execute,
    validate,
  };
}
