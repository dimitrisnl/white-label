import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server';
import type {User} from '@/modules/domain/index.server';
import {Org} from '@/modules/domain/index.server';
import {DatabaseError, InternalServerError} from '@/modules/errors.server';
import {orgAuthorizationService} from '@/modules/services/index.server';

import type {EditOrgProps} from './validation.server';
import {validate} from './validation.server';

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
      yield* _(orgAuthorizationService.canUpdate(userId, orgId));
      const [orgRecord] = yield* _(updateOrgRecord({name, orgId}));
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
