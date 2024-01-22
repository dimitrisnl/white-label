import {faker} from '@faker-js/faker';
import {fail} from 'assert';
import {Effect, Exit} from 'effect';

import * as User from './user.server';

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
        const result = Effect.runSyncExit(User.parse(validUserObject));

        Exit.match(result, {
          onFailure: () => fail(),
          onSuccess: (value) => {
            expect(value).toStrictEqual({
              id: uuid,
              name: 'Dimitrios',
              email: 'dimitrios@example.com',
              emailVerified: true,
              createdAt: new Date('2024-01-21 16:20:01.150513+00'),
              updatedAt: new Date('2024-01-21 16:20:01.150513+00'),
            });
          },
        });
      });

      it('parses and trims name whitespace', () => {
        const result = Effect.runSyncExit(
          User.parse({...validUserObject, name: ' Dimitrios '})
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
          User.parse({...validUserObject, name: 'A'})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing with huge `name`', () => {
        const result = Effect.runSyncExit(
          User.parse({...validUserObject, name: 'AB'.repeat(51)})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `uuid`', () => {
        const result = Effect.runSyncExit(
          User.parse({...validUserObject, id: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `name`', () => {
        const result = Effect.runSyncExit(
          User.parse({...validUserObject, name: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `email`', () => {
        const result = Effect.runSyncExit(
          User.parse({...validUserObject, email: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `emailVerified`', () => {
        const result = Effect.runSyncExit(
          User.parse({...validUserObject, emailVerified: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `createdAt`', () => {
        const result = Effect.runSyncExit(
          User.parse({...validUserObject, createdAt: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `updatedAt`', () => {
        const result = Effect.runSyncExit(
          User.parse({...validUserObject, updatedAt: undefined})
        );
        expect(result._tag).toBe('Failure');
      });
    });

    describe('parse-id', () => {
      it('parses a valid uuid as user-id', () => {
        const result = Effect.runSyncExit(User.parseId(validUserObject.id));
        expect(result._tag).toBe('Success');
      });

      it('fails parsing gibberish as user-id', () => {
        const result = Effect.runSyncExit(User.parseId('gibberish'));
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
      email_verified: true,
      created_at: '2024-01-21 16:20:01.150513+00',
      updated_at: '2024-01-21 16:20:01.150513+00',
    };

    it('parses a normal record', () => {
      const result = Effect.runSyncExit(User.dbRecordToDomain(validRecord));

      Exit.match(result, {
        onFailure: () => fail(),
        onSuccess: (value) => {
          expect(value).toStrictEqual({
            id: uuid,
            name: 'Dimitrios',
            email: 'dimitrios@example.com',
            emailVerified: true,
            createdAt: new Date('2024-01-21 16:20:01.150513+00'),
            updatedAt: new Date('2024-01-21 16:20:01.150513+00'),
          });
        },
      });
    });

    it('fails parsing when missing `uuid`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        User.dbRecordToDomain({...validRecord, id: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `name`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        User.dbRecordToDomain({...validRecord, name: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `email`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        User.dbRecordToDomain({...validRecord, email: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `emailVerified`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        User.dbRecordToDomain({...validRecord, email_verified: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `createdAt`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        User.dbRecordToDomain({...validRecord, created_at: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `updatedAt`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        User.dbRecordToDomain({...validRecord, updated_at: undefined})
      );
      expect(result._tag).toBe('Failure');
    });
  });
});
