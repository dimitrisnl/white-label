import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server';
import {
  DatabaseError,
  InternalServerError,
  OrgNotFoundError,
} from '~/core/lib/errors.server';

import type {Org} from '../domain/org.server';
import {parseOrgId} from '../domain/org.server';

export function getOrgIdBySlug() {
  function execute(slug: Org['slug']) {
    return Effect.gen(function* (_) {
      yield* _(Effect.log(`(get-org-id-by-slug): Getting org ${slug}`));

      const orgRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('orgs', {slug}, {columns: ['id']}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!orgRecord) {
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const orgId = yield* _(parseOrgId(orgRecord.id));

      return orgId;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        OrgIdParseError: () =>
          Effect.fail(
            new InternalServerError({reason: 'Error parsing org id'})
          ),
      })
    );
  }

  return {
    execute,
  };
}
