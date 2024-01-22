import {faker} from '@faker-js/faker';
import {fail} from 'assert';
import {Effect, Exit} from 'effect';

import * as Membership from './membership.server';

describe('domain/membership', () => {
  describe('parsing', () => {
    const userId = faker.string.uuid();
    const orgId = faker.string.uuid();
    const validMembershipObject = {
      org: {
        name: 'Wolfwave',
        id: orgId,
        slug: 'wolfwave',
      },
      user: {
        id: userId,
        name: 'Dimitrios',
        email: 'dimitrios@example.com',
      },
      role: 'OWNER',
      createdAt: '2024-01-21 16:20:01.150513+00',
      updatedAt: '2024-01-21 16:20:01.150513+00',
    };

    describe('parse-membership', () => {
      it('parses a normal membership record', () => {
        const result = Effect.runSyncExit(
          Membership.parse(validMembershipObject)
        );

        Exit.match(result, {
          onFailure: () => fail(),
          onSuccess: (value) => {
            expect(value).toStrictEqual({
              org: {
                name: 'Wolfwave',
                id: orgId,
                slug: 'wolfwave',
              },
              user: {
                id: userId,
                name: 'Dimitrios',
                email: 'dimitrios@example.com',
              },
              role: 'OWNER',
              createdAt: new Date('2024-01-21 16:20:01.150513+00'),
              updatedAt: new Date('2024-01-21 16:20:01.150513+00'),
            });
          },
        });
      });

      it('fails parsing when missing `org`', () => {
        const result = Effect.runSyncExit(
          Membership.parse({...validMembershipObject, org: {}})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing with invalid `user`', () => {
        const result = Effect.runSyncExit(
          Membership.parse({...validMembershipObject, user: {}})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `createdAt`', () => {
        const result = Effect.runSyncExit(
          Membership.parse({...validMembershipObject, createdAt: undefined})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `updatedAt`', () => {
        const result = Effect.runSyncExit(
          Membership.parse({...validMembershipObject, updatedAt: undefined})
        );
        expect(result._tag).toBe('Failure');
      });
    });
  });

  describe('record-to-domain', () => {
    const userId = faker.string.uuid();
    const orgId = faker.string.uuid();

    const orgRecord = {
      name: 'Wolfwave',
      id: orgId,
      slug: 'wolfwave',
    };

    const userRecord = {
      id: userId,
      name: 'Dimitrios',
      email: 'dimitrios@example.com',
    };

    const membershipRecord = {
      role: 'OWNER',
      created_at: '2024-01-21 16:20:01.150513+00',
      updated_at: '2024-01-21 16:20:01.150513+00',
    };

    it('parses a normal record', () => {
      const result = Effect.runSyncExit(
        Membership.dbRecordToDomain(membershipRecord, orgRecord, userRecord)
      );

      Exit.match(result, {
        onFailure: () => fail(),
        onSuccess: (value) => {
          expect(value).toStrictEqual({
            role: 'OWNER',
            createdAt: new Date('2024-01-21 16:20:01.150513+00'),
            updatedAt: new Date('2024-01-21 16:20:01.150513+00'),
            org: {
              id: orgId,
              name: 'Wolfwave',
              slug: 'wolfwave',
            },
            user: {
              id: userId,
              name: 'Dimitrios',
              email: 'dimitrios@example.com',
            },
          });
        },
      });
    });

    it('fails parsing when missing `org`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Membership.dbRecordToDomain(membershipRecord, {}, userRecord)
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `user`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Membership.dbRecordToDomain(membershipRecord, orgRecord, {})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `membership`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Membership.dbRecordToDomain({membershipRecord}, orgRecord, userRecord)
      );
      expect(result._tag).toBe('Failure');
    });
  });
});
