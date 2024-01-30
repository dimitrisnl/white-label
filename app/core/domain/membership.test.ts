import {faker} from '@faker-js/faker';
import {fail} from 'assert';
import {Effect, Exit} from 'effect';

import {Membership} from './membership.server';
import {OWNER} from './membership-role.server';

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
      createdAt: '2012-06-01T12:34:00Z' as const,
      updatedAt: '2012-06-01T12:34:00Z' as const,
    };

    describe('parse-membership', () => {
      it('parses a normal membership record', () => {
        const result = Effect.runSyncExit(
          Membership.fromUnknown(validMembershipObject)
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
              createdAt: new Date('2012-06-01T12:34:00Z'),
              updatedAt: new Date('2012-06-01T12:34:00Z'),
            });
          },
        });
      });

      it('fails parsing when missing `org`', () => {
        const result = Effect.runSyncExit(
          Membership.fromUnknown({...validMembershipObject, org: {}})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing with invalid `user`', () => {
        const result = Effect.runSyncExit(
          Membership.fromUnknown({...validMembershipObject, user: {}})
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `createdAt`', () => {
        const result = Effect.runSyncExit(
          Membership.fromUnknown({
            ...validMembershipObject,
            createdAt: undefined,
          })
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `updatedAt`', () => {
        const result = Effect.runSyncExit(
          Membership.fromUnknown({
            ...validMembershipObject,
            updatedAt: undefined,
          })
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
      org_id: orgId,
      user_id: userId,
      role: OWNER,
      created_at: '2012-06-01T12:34:00Z' as const,
      updated_at: '2012-06-01T12:34:00Z' as const,
    };

    it('parses a normal record', () => {
      const result = Effect.runSyncExit(
        Membership.fromRecord({
          record: membershipRecord,
          org: orgRecord,
          user: userRecord,
        })
      );

      Exit.match(result, {
        onFailure: () => fail(),
        onSuccess: (value) => {
          expect(value).toStrictEqual({
            role: 'OWNER',
            createdAt: new Date('2012-06-01T12:34:00Z'),
            updatedAt: new Date('2012-06-01T12:34:00Z'),
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
        Membership.fromRecord(membershipRecord, {}, userRecord)
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `user`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Membership.fromRecord(membershipRecord, orgRecord, {})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `membership`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        Membership.fromRecord({membershipRecord}, orgRecord, userRecord)
      );
      expect(result._tag).toBe('Failure');
    });
  });
});
