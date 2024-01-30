import {faker} from '@faker-js/faker';
import {fail} from 'assert';
import {Effect, Exit} from 'effect';

import {createUser} from './create-user.server';

describe('use-cases/create-user', () => {
  describe('validation', () => {
    const userObj = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    test('it validates the user', async () => {
      const {validate} = createUser();

      const result = await Effect.runPromiseExit(validate(userObj));
      expect(result._tag).toBe('Success');
    });
    test('it fails on missing `name`', async () => {
      const {validate} = createUser();

      const result = await Effect.runPromiseExit(
        validate({...userObj, name: ''})
      );
      expect(result._tag).toBe('Failure');
    });

    test('it fails on missing `email`', async () => {
      const {validate} = createUser();

      const result = await Effect.runPromiseExit(
        validate({...userObj, email: ''})
      );
      expect(result._tag).toBe('Failure');
    });
    test('it fails on missing `password`', async () => {
      const {validate} = createUser();

      const result = await Effect.runPromiseExit(
        validate({...userObj, password: ''})
      );
      expect(result._tag).toBe('Failure');
    });
  });

  describe('execute', () => {
    test('it creates a new user', async () => {
      const userObj = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const {validate, execute} = createUser();

      const result = await Effect.runPromiseExit(
        Effect.gen(function* (_) {
          const props = yield* _(validate(userObj));
          return yield* _(execute(props));
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
          //
          expect(data.verifyEmailTokenId).toBeDefined();
        },
      });
    });

    test('it fails creating when email exists', async () => {
      const userObj = {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
      };
      const {validate, execute} = createUser();

      const result = await Effect.runPromiseExit(
        Effect.gen(function* (_) {
          const props = yield* _(validate(userObj));
          // Add once
          yield* _(execute(props));
          // Try again
          return yield* _(execute(props));
        })
      );

      Exit.match(result, {
        onFailure: (cause) => {
          if (cause._tag === 'Fail') {
            expect(cause.error._tag).toEqual('AccountAlreadyExistsError');
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
