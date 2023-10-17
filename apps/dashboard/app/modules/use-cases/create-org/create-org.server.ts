import * as Effect from 'effect/Effect';

import {db, pool} from '@/database/db.server.ts';
import {UNIQUE_CONTRAINT} from '@/database/pg-error.ts';
import type {User} from '@/modules/domain/index.server.ts';
import {MembershipRole, Org, Uuid} from '@/modules/domain/index.server.ts';
import {
  DatabaseError,
  InternalServerError,
  SlugAlreadyExistsError,
} from '@/modules/errors.server.ts';

import type {CreateOrgProps} from './validation.server.ts';
import {validate} from './validation.server.ts';

function insertOrg({
  id,
  name,
  slug,
}: {
  id: Uuid.Uuid;
  name: Org.Org['name'];
  slug: Org.Org['slug'];
}) {
  return Effect.tryPromise({
    try: () => db.insert('orgs', {id, name, slug}).run(pool),
    catch: (error) => {
      // @ts-expect-error
      if (error && error.code == UNIQUE_CONTRAINT) {
        return new SlugAlreadyExistsError();
      }

      return new DatabaseError();
    },
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
      yield* _(Effect.log(`Use-case(create-org): Creating org ${name}`));
      const orgId = yield* _(Uuid.generate());

      const [orgIdPrefix] = orgId.split('-');
      const baseSlug = yield* _(Org.slugify(name));
      const slug = `${baseSlug}-${orgIdPrefix}`;

      const orgRecord = yield* _(insertOrg({name, id: orgId, slug}));
      const org = yield* _(Org.dbRecordToDomain(orgRecord));
      yield* _(insertMembership(org.id, userId));

      return org;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () => Effect.fail(new InternalServerError()),
        DbRecordParseError: () => Effect.fail(new InternalServerError()),
        UUIDGenerationError: () => Effect.fail(new InternalServerError()),
        SlugAlreadyExistsError: () => Effect.fail(new InternalServerError()),
      })
    );
  }

  return {
    execute,
    validate,
  };
}
