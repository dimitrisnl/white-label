import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server.ts';
import {Org} from '@/modules/domain/index.server.ts';
import {
  DatabaseError,
  InternalServerError,
  OrgNotFoundError,
} from '@/modules/errors.server.ts';

function selectOrgRecord(slug: Org.Org['slug']) {
  return Effect.tryPromise({
    try: () => db.selectOne('orgs', {slug}, {columns: ['id']}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function getOrgIdBySlug() {
  function execute(slug: Org.Org['slug']) {
    return Effect.gen(function* (_) {
      yield* _(Effect.log(`Use-case(get-org-id-by-slug): Getting org ${slug}`));
      const orgRecord = yield* _(selectOrgRecord(slug));

      if (!orgRecord) {
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const orgId = yield* _(Org.parseId(orgRecord.id));

      return orgId;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
        ParseOrgIdError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {
    execute,
  };
}
