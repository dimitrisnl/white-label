import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server.ts';
import type {User} from '@/modules/domain/index.server.ts';
import {Org} from '@/modules/domain/index.server.ts';
import {
  DatabaseError,
  InternalServerError,
  OrgNotFoundError,
} from '@/modules/errors.server.ts';
import {orgAuthorizationService} from '@/modules/services/index.server.ts';

import type {EditOrgProps} from './validation.server.ts';
import {validate} from './validation.server.ts';

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
  return {
    execute,
    validate,
  };
}
