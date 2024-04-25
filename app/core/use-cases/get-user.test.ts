import {faker} from '@faker-js/faker';
import {fail} from 'assert';
import {Effect, Exit} from 'effect';

import {db, testDbPool} from '~/test/dp-pool';
import {truncate} from '~/test/setup';

import {createUser} from './create-user.server';
import {getUser} from './get-user.server';

describe('use-cases/get-user', () => {
  describe('execute', () => {
    afterEach(async () => {
      await truncate();
    });
    test('it gets the user by id', async () => {
      const userObj = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const result = await Effect.runPromiseExit(
        Effect.gen(function* () {
          const {user: newUser} = yield* // @ts-expect-error
          createUser({pool: testDbPool, db: db}).execute(userObj);
          return yield* getUser({pool: testDbPool, db: db}).execute({
            userId: newUser.id,
          });
        })
      );

      Exit.match(result, {
        onFailure: () => {
          fail();
        },
        onSuccess: (data) => {
          expect(data.user.name).toEqual(userObj.name);
          expect(data.user.email).toEqual(userObj.email.toLowerCase());
          expect(data.user.emailVerified).toEqual(false);
          expect(data.user.createdAt).toBeDefined();
          expect(data.user.updatedAt).toBeDefined();
        },
      });
    });

    test('fails to get anything if not existing', async () => {
      const result = await Effect.runPromiseExit(
        Effect.gen(function* () {
          return yield* // @ts-expect-error
          getUser({pool: testDbPool, db: db}).execute(faker.string.uuid());
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
