import {faker} from '@faker-js/faker';
import {fail} from 'assert';
import {Effect, Exit} from 'effect';

import {db, testDbPool} from '~/test/dp-pool';
import {truncate} from '~/test/setup';

import {createOrg} from './create-org.server';
import {createUser} from './create-user.server';

describe('use-cases/create-org', () => {
  describe('validation', () => {
    const orgObj = {
      name: faker.company.name(),
    };
    test('it validates the org', async () => {
      const {validate} = createOrg({
        pool: testDbPool,
        db: db,
      });

      const result = await Effect.runPromiseExit(validate(orgObj));
      expect(result._tag).toBe('Success');
    });
    test('it fails on missing `name`', async () => {
      const {validate} = createOrg({pool: testDbPool, db: db});

      const result = await Effect.runPromiseExit(
        validate({...orgObj, name: ''})
      );
      expect(result._tag).toBe('Failure');
    });
  });

  describe('execute', () => {
    afterEach(async () => {
      await truncate();
    });
    test('creates a new org', async () => {
      const orgObj = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const userObj = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const {validate, execute} = createOrg({pool: testDbPool, db: db});

      const result = await Effect.runPromiseExit(
        Effect.gen(function* (_) {
          const props = yield* _(validate(orgObj));

          const userProps = yield* _(
            createUser({pool: testDbPool, db: db}).validate(userObj)
          );
          const {user: newUser} = yield* _(
            createUser({pool: testDbPool, db: db}).execute(userProps)
          );

          return yield* _(
            execute({
              props,
              userId: newUser.id,
            })
          );
        })
      );

      Exit.match(result, {
        onFailure: () => {
          fail();
        },
        onSuccess: (data) => {
          expect(data.name).toEqual(orgObj.name);
          expect(data.slug).toBeDefined();
          expect(data.id).toBeDefined();
          expect(data.createdAt).toBeDefined();
          expect(data.updatedAt).toBeDefined();
        },
      });
    });

    test('fails creating a new org when user is non-existent', async () => {
      const orgObj = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const {validate, execute} = createOrg({pool: testDbPool, db: db});

      const result = await Effect.runPromiseExit(
        Effect.gen(function* (_) {
          const props = yield* _(validate(orgObj));

          // @ts-expect-error
          return yield* _(execute({props}, faker.string.uuid()));
        })
      );

      Exit.match(result, {
        onFailure: (cause) => {
          if (cause._tag === 'Fail') {
            expect(cause.error._tag).toEqual('UserNotFoundError');
          } else {
            fail();
          }
        },
        onSuccess: () => {
          fail();
        },
      });
    });
  });
});
