import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {Org} from '~/core/domain/org.server';
import type {User} from '~/core/domain/user.server';
import {
  DatabaseError,
  InternalServerError,
  OrgNotFoundError,
} from '~/core/lib/errors.server';
import {orgAuthorizationService} from '~/core/services/org-authorization-service.server';

export function getOrg({pool, db}: {pool: PgPool; db: DB}) {
  function execute({orgId, userId}: {orgId: Org['id']; userId: User['id']}) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`(get-org): Getting org ${orgId} for user ${userId}`)
      );
      yield* _(orgAuthorizationService({db, pool}).canView({userId, orgId}));

      const orgRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('orgs', {id: orgId}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!orgRecord) {
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const org = yield* _(Org.fromRecord(orgRecord));

      return org;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        OrgParseError: () =>
          Effect.fail(new InternalServerError({reason: 'Error parsing org'})),
      })
    );
  }

  return {
    execute,
  };
}
