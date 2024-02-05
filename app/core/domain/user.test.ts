import {faker} from '@faker-js/faker';
import {fail} from 'assert';
import {Effect, Exit} from 'effect';

import {parseUserId, User} from './user.server';

describe('domain/user', () => {
  describe('parsing', () => {
    const uuid = faker.string.uuid();
    const validUserObject = {
      id: uuid,
      name: 'Dimitrios',
      email: 'dimitrios@example.com',
      emailVerified: true,
      createdAt: '2024-01-21 16:20:01.150513+00',
      updatedAt: '2024-01-21 16:20:01.150513+00',
    };

    describe('parse-user', () => {
      it('parses a normal user record', () => {
        const result = Effect.runSyncExit(User.fromUnknown(validUserObject));

        Exit.match(result, {
          onFailure: () => fail(),
          onSuccess: (value) => {
            expect(value.id).toBe(uuid);
            expect(value.name).toBe('Dimitrios');
            expect(value.email).toBe('dimitrios@example.com');
            expect(value.emailVerified).toBe(true);
            expect(value.createdAt).toStrictEqual(
              new Date('2024-01-21 16:20:01.150513+00')
            );
            expect(value.updatedAt).toStrictEqual(
              new Date('2024-01-21 16:20:01.150513+00')
            );
          },
        });
      });

      it('parses and trims name whitespace', () => {
        const result = Effect.runSyncExit(
          User.fromUnknown({...validUserObject, name: ' Dimitrios '})
        );

        Exit.match(result, {
          onFailure: () => fail,
          onSuccess: (value) => {
            expect(value.name).toBe('Dimitrios');
          },
        });
      });

      it('fails parsing with short `name`', () => {
        const result = Effect.runSyncExit(
          User.fromUnknown({...validUserObject, name: 'A'})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing with huge `name`', () => {
        const result = Effect.runSyncExit(
          User.fromUnknown({...validUserObject, name: 'AB'.repeat(51)})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `uuid`', () => {
        const result = Effect.runSyncExit(
          User.fromUnknown({...validUserObject, id: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `name`', () => {
        const result = Effect.runSyncExit(
          User.fromUnknown({...validUserObject, name: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `email`', () => {
        const result = Effect.runSyncExit(
          User.fromUnknown({...validUserObject, email: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `emailVerified`', () => {
        const result = Effect.runSyncExit(
          User.fromUnknown({...validUserObject, emailVerified: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `createdAt`', () => {
        const result = Effect.runSyncExit(
          User.fromUnknown({...validUserObject, createdAt: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `updatedAt`', () => {
        const result = Effect.runSyncExit(
          User.fromUnknown({...validUserObject, updatedAt: undefined})
        );
        expect(result._tag).toBe('Failure');
      });
    });

    describe('parse-id', () => {
      it('parses a valid uuid as user-id', () => {
        const result = Effect.runSyncExit(parseUserId(validUserObject.id));
        expect(result._tag).toBe('Success');
      });

      it('fails parsing gibberish as user-id', () => {
        const result = Effect.runSyncExit(parseUserId('gibberish'));
        expect(result._tag).toBe('Failure');
      });
    });
  });

  describe('record-to-domain', () => {
    const uuid = faker.string.uuid();
    const validRecord = {
      id: uuid,
      name: 'Dimitrios',
      email: 'dimitrios@example.com',
      password: '123123',
      email_verified: true,
      created_at: '2012-06-01T12:34:00Z' as const,
      updated_at: '2012-06-01T12:34:00Z' as const,
    };

    it('parses a normal record', () => {
      const result = Effect.runSyncExit(User.fromRecord(validRecord));

      Exit.match(result, {
        onFailure: () => fail(),
        onSuccess: (value) => {
          expect(value.id).toBe(uuid);
          expect(value.name).toBe('Dimitrios');
          expect(value.email).toBe('dimitrios@example.com');
          expect(value.emailVerified).toBe(true);
          expect(value.createdAt).toStrictEqual(
            new Date('2012-06-01T12:34:00.000Z')
          );
          expect(value.updatedAt).toStrictEqual(
            new Date('2012-06-01T12:34:00.000Z')
          );
        },
      });
    });

    it('fails parsing when missing `uuid`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        User.fromRecord({...validRecord, id: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `name`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        User.fromRecord({...validRecord, name: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `email`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        User.fromRecord({...validRecord, email: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `emailVerified`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        User.fromRecord({...validRecord, email_verified: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `createdAt`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        User.fromRecord({...validRecord, created_at: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `updatedAt`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        User.fromRecord({...validRecord, updated_at: undefined})
      );
      expect(result._tag).toBe('Failure');
    });
  });
});
