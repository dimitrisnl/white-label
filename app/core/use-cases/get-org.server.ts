import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import {
  DatabaseError,
  InternalServerError,
  OrgNotFoundError,
} from '~/core/lib/errors.server';
import {orgAuthorizationService} from '~/core/services/org-authorization-service.server';

import {Org} from '../domain/org.server';
import type {User} from '../domain/user.server';

export function getOrg() {
  function execute(orgId: Org['id'], userId: User['id']) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`Use-case(get-org): Getting org ${orgId} for user ${userId}`)
      );
      yield* _(orgAuthorizationService.canView(userId, orgId));

      const orgRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('orgs', {id: orgId}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!orgRecord) {
        yield* _(
          Effect.logError(`
          Use-case(get-org): Org ${orgId} not found`)
        );
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const org = yield* _(Org.fromRecord(orgRecord));

      return org;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        OrgParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {
    execute,
  };
}
