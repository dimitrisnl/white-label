import {faker} from '@faker-js/faker';
import {fail} from 'assert';
import {Effect, Exit} from 'effect';

import * as Org from './org.server';

describe('domain/org', () => {
  describe('parsing', () => {
    const uuid = faker.string.uuid();
    const validOrgObject = {
      id: uuid,
      name: 'wolfwave',
      slug: 'wolfwave-123',
      createdAt: '2024-01-21 16:20:01.150513+00',
      updatedAt: '2024-01-21 16:20:01.150513+00',
    };

    describe('parse-org', () => {
      it('parses a normal org record', () => {
        const result = Effect.runSyncExit(Org.parse(validOrgObject));

        Exit.match(result, {
          onFailure: () => fail(),
          onSuccess: (value) => {
            expect(value).toStrictEqual({
              id: uuid,
              name: 'wolfwave',
              slug: 'wolfwave-123',
              createdAt: new Date('2024-01-21 16:20:01.150513+00'),
              updatedAt: new Date('2024-01-21 16:20:01.150513+00'),
            });
          },
        });
      });

      it('fails parsing with short `name`', () => {
        const result = Effect.runSyncExit(
          Org.parse({...validOrgObject, name: 'A'})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing with huge `name`', () => {
        const result = Effect.runSyncExit(
          Org.parse({...validOrgObject, name: 'AB'.repeat(51)})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `uuid`', () => {
        const result = Effect.runSyncExit(
          Org.parse({...validOrgObject, id: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `name`', () => {
        const result = Effect.runSyncExit(
          Org.parse({...validOrgObject, name: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `slug`', () => {
        const result = Effect.runSyncExit(
          Org.parse({...validOrgObject, slug: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `createdAt`', () => {
        const result = Effect.runSyncExit(
          Org.parse({...validOrgObject, createdAt: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `updatedAt`', () => {
        const result = Effect.runSyncExit(
          Org.parse({...validOrgObject, updatedAt: undefined})
        );
        expect(result._tag).toBe('Failure');
      });
    });

    describe('parse-id', () => {
      it('parses a valid uuid as org-id', () => {
        const result = Effect.runSyncExit(Org.parseId(validOrgObject.id));
        expect(result._tag).toBe('Success');
      });

      it('fails parsing gibberish as org-id', () => {
        const result = Effect.runSyncExit(Org.parseId('gibberish'));
        expect(result._tag).toBe('Failure');
      });
    });
  });

  describe('record-to-domain', () => {
    const uuid = faker.string.uuid();
    const validRecord = {
      id: uuid,
      name: 'wolfwave',
      slug: 'wolfwave-123',
      created_at: '2024-01-21 16:20:01.150513+00',
      updated_at: '2024-01-21 16:20:01.150513+00',
    };

    it('parses a normal record', () => {
      const result = Effect.runSyncExit(Org.dbRecordToDomain(validRecord));

      Exit.match(result, {
        onFailure: () => fail(),
        onSuccess: (value) => {
          expect(value).toStrictEqual({
            id: uuid,
            name: 'wolfwave',
            slug: 'wolfwave-123',
            createdAt: new Date('2024-01-21 16:20:01.150513+00'),
            updatedAt: new Date('2024-01-21 16:20:01.150513+00'),
          });
        },
      });
    });

    it('fails parsing when missing `uuid`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Org.dbRecordToDomain({...validRecord, id: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `name`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Org.dbRecordToDomain({...validRecord, name: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `slug`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Org.dbRecordToDomain({...validRecord, slug: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `createdAt`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Org.dbRecordToDomain({...validRecord, created_at: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `updatedAt`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Org.dbRecordToDomain({...validRecord, updated_at: undefined})
      );
      expect(result._tag).toBe('Failure');
    });
  });

  describe('slug', () => {
    it('generates a slug', () => {
      const result = Effect.runSyncExit(Org.slugify('james bond'));
      Exit.match(result, {
        onFailure: () => fail(),
        onSuccess: (value) => {
          expect(value).toBe('james-bond');
        },
      });
    });
    it('parses a slug', () => {
      const result = Effect.runSyncExit(Org.parseSlug('wolfwave'));
      expect(result._tag).toBe('Success');
    });
    it('fails parsing a small slug', () => {
      const result = Effect.runSyncExit(Org.parseSlug('w'));
      expect(result._tag).toBe('Failure');
    });
  });
});
