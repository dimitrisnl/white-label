import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import {
  DatabaseError,
  InternalServerError,
  OrgNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';
import {orgAuthorizationService} from '~/core/services/org-authorization-service.server.ts';

import {Org, orgNameSchema} from '../domain/org.server';
import type {User} from '../domain/user.server';

const validationSchema = Schema.struct({
  name: orgNameSchema,
});

export type EditOrgProps = Schema.Schema.To<typeof validationSchema>;

export function editOrg() {
  function execute({name}: EditOrgProps, orgId: Org['id'], userId: User['id']) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`Use-case(edit-org): Editing org ${orgId} with name ${name}`)
      );
      yield* _(orgAuthorizationService.canUpdate(userId, orgId));

      const records = yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .update('orgs', {name, updated_at: db.sql`now()`}, {id: orgId})
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (records.length === 0 || !records[0]) {
        yield* _(
          Effect.logError(`
          Use-case(edit-org): Org ${orgId} not found`)
        );
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const org = yield* _(Org.fromRecord(records[0]));
      return org;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        OrgParseError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
