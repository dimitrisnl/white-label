import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server';
import type {User} from '@/modules/domain/index.server';
import {MembershipRole, Org, Uuid} from '@/modules/domain/index.server';
import {DatabaseError, InternalServerError} from '@/modules/errors.server';

import type {CreateOrgProps} from './validation.server';
import {validate} from './validation.server';

function insertOrg({id, name}: {id: Uuid.Uuid; name: Org.Org['name']}) {
  return Effect.tryPromise({
    try: () => db.insert('orgs', {id, name: name}).run(pool),
    catch: () => new DatabaseError(),
  });
}

function insertMembership(orgId: Org.Org['id'], userId: User.User['id']) {
  return Effect.tryPromise({
    try: () =>
      db
        .insert('memberships', {
          org_id: orgId,
          user_id: userId,
          role: MembershipRole.OWNER,
        })
        .run(pool),
    catch: () => new DatabaseError(),
  });
}

export function createOrg() {
  function execute(props: CreateOrgProps, userId: User.User['id']) {
    const {name} = props;
    return Effect.gen(function* (_) {
      const orgId = yield* _(Uuid.generate());
      const orgRecord = yield* _(insertOrg({name, id: orgId}));
      const org = yield* _(Org.dbRecordToDomain(orgRecord));
      yield* _(insertMembership(org.id, userId));

      return org;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
        UUIDGenerationError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {
    execute,
    validate,
  };
}
