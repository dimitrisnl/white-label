import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server';
import type {Org, User} from '@/modules/domain/index.server';
import {MembershipInvitation} from '@/modules/domain/index.server';
import {DatabaseError, InternalServerError} from '@/modules/errors.server';
import {invitationAuthorizationService} from '@/modules/services/index.server';

function getInvitationRecords(orgId: Org.Org['id']) {
  return Effect.tryPromise({
    try: () =>
      db
        .select('membership_invitations', {
          org_id: orgId,
        })
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

export function getInvitations() {
  function execute(orgId: Org.Org['id'], userId: User.User['id']) {
    return Effect.gen(function* (_) {
      yield* _(invitationAuthorizationService.canView(userId, orgId));
      const invitationRecords = yield* _(getInvitationRecords(orgId));

      const invitations = yield* _(
        Effect.all(
          invitationRecords.map((invitationRecord) =>
            MembershipInvitation.dbRecordToDomain(invitationRecord)
          ),
          {concurrency: 'unbounded'}
        )
      );

      return invitations;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {execute};
}
