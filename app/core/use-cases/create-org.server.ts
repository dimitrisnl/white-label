import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';
import {isDatabaseError} from 'zapatos/db';

import {db, pool} from '~/core/db/db.server.ts';
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

export function createOrg() {
  function execute({name}: CreateOrgProps, userId: User.User['id']) {
    return Effect.gen(function* (_) {
      yield* _(Effect.log(`Use-case(create-org): Creating org ${name}`));

      const userRecord = yield* _(
        Effect.tryPromise({
          try: () => db.selectOne('users', {id: userId}).run(pool),
          catch: () => new DatabaseError(),
        })
      );

      if (!userRecord) {
        return yield* _(Effect.fail(new UserNotFoundError()));
      }

      const orgId = yield* _(Uuid.generate());
      const [orgIdPrefix] = orgId.split('-');
      const baseSlug = yield* _(Org.slugify(name));
      const slug = `${baseSlug}-${orgIdPrefix}`;

      const orgRecord = yield* _(
        Effect.tryPromise({
          try: () => db.insert('orgs', {id: orgId, name, slug}).run(pool),
          catch: (error) => {
            if (
              isDatabaseError(
                // @ts-expect-error
                error,
                'IntegrityConstraintViolation_UniqueViolation'
              )
            ) {
              return new SlugAlreadyExistsError();
            }

            return new DatabaseError();
          },
        })
      );

      yield* _(
        Effect.tryPromise({
          try: () =>
            db
              .insert('memberships', {
                org_id: orgId,
                user_id: userId,
                role: MembershipRole.OWNER,
              })
              .run(pool),
          catch: () => new DatabaseError(),
        })
      );

      const org = yield* _(Org.dbRecordToDomain(orgRecord));

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
