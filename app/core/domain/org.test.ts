import {faker} from '@faker-js/faker';
import {fail} from 'assert';
import {Effect, Exit} from 'effect';

import {Org, parseOrgId, parseOrgSlug} from './org.server';

describe('domain/org', () => {
  describe('parsing', () => {
    const uuid = faker.string.uuid();
    const validOrgObject = {
      id: uuid,
      name: 'wolfwave',
      slug: 'wolfwave-123',
      createdAt: '2012-06-01T12:34:00Z' as const,
      updatedAt: '2012-06-01T12:34:00Z' as const,
    };

    describe('parse-org', () => {
      it('parses a normal org record', () => {
        const result = Effect.runSyncExit(Org.fromUnknown(validOrgObject));

        Exit.match(result, {
          onFailure: () => fail(),
          onSuccess: (value) => {
            expect(value).toStrictEqual({
              id: uuid,
              name: 'wolfwave',
              slug: 'wolfwave-123',
              createdAt: new Date('2012-06-01T12:34:00Z'),
              updatedAt: new Date('2012-06-01T12:34:00Z'),
            });
          },
        });
      });

      it('fails parsing with short `name`', () => {
        const result = Effect.runSyncExit(
          Org.fromUnknown({...validOrgObject, name: 'A'})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing with huge `name`', () => {
        const result = Effect.runSyncExit(
          Org.fromUnknown({...validOrgObject, name: 'AB'.repeat(51)})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `uuid`', () => {
        const result = Effect.runSyncExit(
          Org.fromUnknown({...validOrgObject, id: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `name`', () => {
        const result = Effect.runSyncExit(
          Org.fromUnknown({...validOrgObject, name: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `slug`', () => {
        const result = Effect.runSyncExit(
          Org.fromUnknown({...validOrgObject, slug: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `createdAt`', () => {
        const result = Effect.runSyncExit(
          Org.fromUnknown({...validOrgObject, createdAt: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `updatedAt`', () => {
        const result = Effect.runSyncExit(
          Org.fromUnknown({...validOrgObject, updatedAt: undefined})
        );
        expect(result._tag).toBe('Failure');
      });
    });

    describe('parse-id', () => {
      it('parses a valid uuid as org-id', () => {
        const result = Effect.runSyncExit(parseOrgId(validOrgObject.id));
        expect(result._tag).toBe('Success');
      });

      it('fails parsing gibberish as org-id', () => {
        const result = Effect.runSyncExit(parseOrgId('gibberish'));
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
      created_at: '2012-06-01T12:34:00Z' as const,
      updated_at: '2012-06-01T12:34:00Z' as const,
    };

    it('parses a normal record', () => {
      const result = Effect.runSyncExit(Org.fromRecord(validRecord));

      Exit.match(result, {
        onFailure: () => fail(),
        onSuccess: (value) => {
          expect(value).toStrictEqual({
            id: uuid,
            name: 'wolfwave',
            slug: 'wolfwave-123',
            createdAt: new Date('2012-06-01T12:34:00Z'),
            updatedAt: new Date('2012-06-01T12:34:00Z'),
          });
        },
      });
    });

    it('fails parsing when missing `uuid`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Org.fromRecord({...validRecord, id: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `name`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Org.fromRecord({...validRecord, name: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `slug`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Org.fromRecord({...validRecord, slug: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `createdAt`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Org.fromRecord({...validRecord, created_at: undefined})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `updatedAt`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Org.fromRecord({...validRecord, updated_at: undefined})
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
      const result = Effect.runSyncExit(parseOrgSlug('wolfwave'));
      expect(result._tag).toBe('Success');
    });
    it('fails parsing a small slug', () => {
      const result = Effect.runSyncExit(parseOrgSlug('w'));
      expect(result._tag).toBe('Failure');
    });
  });
});
