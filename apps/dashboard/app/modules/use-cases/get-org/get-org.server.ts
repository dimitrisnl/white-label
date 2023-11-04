import * as Effect from 'effect/Effect';

import {db, pool} from '~/database/db.server.ts';
import type {User} from '~/modules/domain/index.server.ts';
import {Org} from '~/modules/domain/index.server.ts';
import {
  DatabaseError,
  InternalServerError,
  OrgNotFoundError,
} from '~/modules/errors.server.ts';
import {orgAuthorizationService} from '~/modules/services/index.server.ts';

function selectOrgRecord(id: Org.Org['id']) {
  return Effect.tryPromise({
    try: () => db.selectOne('orgs', {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function getOrg() {
  function execute(orgId: Org.Org['id'], userId: User.User['id']) {
    return Effect.gen(function* (_) {
      console.log(userId);
      yield* _(
        Effect.log(`Use-case(get-org): Getting org ${orgId} for user ${userId}`)
      );
      yield* _(orgAuthorizationService.canView(userId, orgId));
      const orgRecord = yield* _(selectOrgRecord(orgId));

      if (!orgRecord) {
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const org = yield* _(Org.dbRecordToDomain(orgRecord));

      return org;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {
    execute,
  };
}
