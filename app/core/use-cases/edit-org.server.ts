import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import type {DB, PgPool} from '~/core/db/types';
import {Org, orgNameSchema} from '~/core/domain/org.server';
import type {User} from '~/core/domain/user.server';
import {
  DatabaseError,
  InternalServerError,
  OrgNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';
import {orgAuthorizationService} from '~/core/services/org-authorization-service.server.ts';

const validationSchema = Schema.Struct({
  name: orgNameSchema,
});

export type EditOrgProps = Schema.Schema.Type<typeof validationSchema>;

export function editOrg({pool, db}: {pool: PgPool; db: DB}) {
  function execute({
    props: {name},
    orgId,
    userId,
  }: {
    props: EditOrgProps;
    orgId: Org['id'];
    userId: User['id'];
  }) {
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`(edit-org): Editing org ${orgId} with name ${name}`)
      );
      yield* _(
        orgAuthorizationService({
          pool,
          db,
        }).canUpdate({userId, orgId})
      );

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
        return yield* _(Effect.fail(new OrgNotFoundError()));
      }

      const org = yield* _(Org.fromRecord(records[0]));
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

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
