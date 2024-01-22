import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import * as Org from '~/core/domain/org.server.ts';
import type * as User from '~/core/domain/user.server.ts';
import {
  DatabaseError,
  InternalServerError,
  OrgNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';
import {orgAuthorizationService} from '~/core/services/org-authorization-service.server.ts';

const validationSchema = Schema.struct({
  name: Org.orgNameSchema,
});

export type EditOrgProps = Schema.Schema.To<typeof validationSchema>;

function updateOrgRecord({
  name,
  orgId,
}: {
  name: Org.Org['name'];
  orgId: Org.Org['id'];
}) {
  return Effect.tryPromise({
    try: () => db.update('orgs', {name}, {id: orgId}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function editOrg() {
  function execute(
    props: EditOrgProps,
    orgId: Org.Org['id'],
    userId: User.User['id']
  ) {
    const {name} = props;
    return Effect.gen(function* (_) {
      yield* _(
        Effect.log(`Use-case(edit-org): Editing org ${orgId} with name ${name}`)
      );
      yield* _(orgAuthorizationService.canUpdate(userId, orgId));

      const [orgRecord] = yield* _(updateOrgRecord({name, orgId}));

      if (!orgRecord) {
        yield* _(
          Effect.logError(`
          Use-case(edit-org): Org ${orgId} not found`)
        );
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

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
