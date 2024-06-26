import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';
import {isDatabaseError} from 'zapatos/db';

import {
  DatabaseError,
  InternalServerError,
  SlugAlreadyExistsError,
  UserNotFoundError,
} from '~/core/lib/errors.server.ts';
import {schemaResolver} from '~/core/lib/validation-helper.server';

import type {DB, PgPool} from '../db/types';
import {OWNER} from '../domain/membership-role.server';
import {Org, orgNameSchema} from '../domain/org.server';
import type {User} from '../domain/user.server';
import {generateUUID} from '../domain/uuid.server';

const validationSchema = Schema.Struct({
  name: orgNameSchema,
});

export type CreateOrgProps = Schema.Schema.Type<typeof validationSchema>;

export function createOrg({pool, db}: {pool: PgPool; db: DB}) {
  function execute({
    props: {name},
    userId,
  }: {
    props: CreateOrgProps;
    userId: User['id'];
  }) {
    return Effect.gen(function* () {
      yield* Effect.log(`(create-org): Creating org ${name}`);

      const userRecord = yield* Effect.tryPromise({
        try: () => db.selectOne('users', {id: userId}).run(pool),
        catch: () => new DatabaseError(),
      });

      if (!userRecord) {
        return yield* Effect.fail(new UserNotFoundError());
      }

      const orgId = yield* generateUUID();
      const [orgIdPrefix] = orgId.split('-');
      const baseSlug = yield* Org.slugify(name);
      const slug = `${baseSlug}-${orgIdPrefix}`;

      const orgRecord = yield* Effect.tryPromise({
        try: () => db.insert('orgs', {id: orgId, name, slug}).run(pool),
        catch: (error) => {
          if (
            isDatabaseError(
              // @ts-expect-error
              error,
              'IntegrityConstraintViolation_UniqueViolation'
            )
          ) {
            return new SlugAlreadyExistsError({
              slug,
              orgName: name,
              orgId: orgId,
            });
          }

          return new DatabaseError();
        },
      });

      yield* Effect.tryPromise({
        try: () =>
          db
            .insert('memberships', {
              org_id: orgId,
              user_id: userId,
              role: OWNER,
            })
            .run(pool),
        catch: () => new DatabaseError(),
      });

      const org = yield* Org.fromRecord(orgRecord);

      return org;
    }).pipe(
      Effect.catchTags({
        DatabaseError: () =>
          Effect.fail(new InternalServerError({reason: 'Database error'})),
        OrgParseError: () =>
          Effect.fail(
            new InternalServerError({reason: 'Error parsing org record'})
          ),
        UUIDGenerationError: () =>
          Effect.fail(
            new InternalServerError({reason: 'UUID generation error'})
          ),
        SlugAlreadyExistsError: (metadata) =>
          Effect.fail(
            new InternalServerError({reason: 'Slug already exists', metadata})
          ),
      })
    );
  }

  const validate = schemaResolver(validationSchema);

  return {
    execute,
    validate,
  };
}
