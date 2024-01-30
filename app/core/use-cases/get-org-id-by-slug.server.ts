import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import * as Org from '~/core/domain/org.server.ts';
import {
  DatabaseError,
  InternalServerError,
  OrgNotFoundError,
} from '~/core/lib/errors.server';

export function getOrgIdBySlug() {
  function execute(slug: Org.Org['slug']) {
    return Effect.gen(function* (_) {
      yield* _(Effect.log(`Use-case(get-org-id-by-slug): Getting org ${slug}`));

      const orgRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('orgs', {slug}, {columns: ['id']}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!orgRecord) {
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const orgId = yield* _(Org.parseId(orgRecord.id));

      return orgId;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        ParseOrgIdError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {
    execute,
  };
}
