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
            expect(value.org).toStrictEqual({
              name: 'Wolfwave',
              id: orgId,
              slug: 'wolfwave',
            });
            expect(value.user).toStrictEqual({
              id: userId,
              name: 'Dimitrios',
              email: 'dimitrios@example.com',
            });
            expect(value.role).toBe('OWNER');
            expect(value.createdAt).toStrictEqual(
              new Date('2012-06-01T12:34:00Z')
            );
            expect(value.updatedAt).toStrictEqual(
              new Date('2012-06-01T12:34:00Z')
            );
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
          expect(value.role).toBe('OWNER');
          expect(value.createdAt).toStrictEqual(
            new Date('2012-06-01T12:34:00Z')
          );
          expect(value.updatedAt).toStrictEqual(
            new Date('2012-06-01T12:34:00Z')
          );
          expect(value.org).toStrictEqual({
            id: orgId,
            name: 'Wolfwave',
            slug: 'wolfwave',
          });
          expect(value.user).toStrictEqual({
            id: userId,
            name: 'Dimitrios',
            email: 'dimitrios@example.com',
          });
        },
      });
    });

    it('fails parsing when missing `org`', () => {
      const result = Effect.runSyncExit(
        Membership.fromRecord({
          record: membershipRecord,
          // @ts-expect-error
          org: {},
          user: userRecord,
        })
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `user`', () => {
      const result = Effect.runSyncExit(
        Membership.fromRecord({
          record: membershipRecord,
          org: orgRecord,
          // @ts-expect-error
          user: {},
        })
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `membership`', () => {
      const result = Effect.runSyncExit(
        Membership.fromRecord({
          // @ts-expect-error
          record: {},
          org: orgRecord,
          user: userRecord,
        })
      );
      expect(result._tag).toBe('Failure');
    });
  });
});
