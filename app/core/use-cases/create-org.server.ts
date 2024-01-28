import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {db, pool} from '~/core/db/db.server.ts';
import {UNIQUE_CONSTRAINT} from '~/core/db/pg-error.ts';
import * as MembershipRole from '~/core/domain/membership-role.server.ts';
import * as Org from '~/core/domain/org.server.ts';
import type * as User from '~/core/domain/user.server.ts';
import * as Uuid from '~/core/domain/uuid.server.ts';
import {
  DatabaseError,
  InternalServerError,
  SlugAlreadyExistsError,
  UserNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

const validationSchema = Schema.struct({
  name: Org.orgNameSchema,
});

export type CreateOrgProps = Schema.Schema.To<typeof validationSchema>;

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
      if (error && error.code == UNIQUE_CONSTRAINT) {
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

function selectUserRecord(id: User.User['id']) {
  return Effect.tryPromise({
    try: () => db.selectOne('users', {id}).run(pool),
    catch: () => new DatabaseError(),
  });
}

export function createOrg() {
  function execute(props: CreateOrgProps, userId: User.User['id']) {
    const {name} = props;
    return Effect.gen(function* (_) {
      yield* _(Effect.log(`Use-case(create-org): Creating org ${name}`));

      const userRecord = yield* _(selectUserRecord(userId));

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

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

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}