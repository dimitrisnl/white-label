import {faker} from '@faker-js/faker';
import {fail} from 'assert';
import {Effect, Exit} from 'effect';

import {DECLINED} from './invite-status.server';
import {MembershipInvitation} from './membership-invitation.server';
import {OWNER} from './membership-role.server';

describe('domain/membership-invitation', () => {
  describe('parsing', () => {
    const orgId = faker.string.uuid();
    const invitationId = faker.string.uuid();

    const validMembershipInvitationObject = {
      org: {
        name: 'Wolfwave',
        id: orgId,
        slug: 'wolfwave',
      },
      id: invitationId,
      email: 'dimitrios@example.com',
      status: 'PENDING',
      role: 'OWNER',
      createdAt: '2012-06-01T12:34:00Z',
      updatedAt: '2012-06-01T12:34:00Z',
    };

    describe('parse-membership-invitation', () => {
      it('parses a normal membership-invitation record', () => {
        const result = Effect.runSyncExit(
          MembershipInvitation.fromUnknown(validMembershipInvitationObject)
        );

        Exit.match(result, {
          onFailure: () => fail(),
          onSuccess: (value) => {
            expect(value.org.id).toBe(orgId);
            expect(value.org.name).toBe('Wolfwave');
            expect(value.org.slug).toBe('wolfwave');
            expect(value.id).toBe(invitationId);
            expect(value.email).toBe('dimitrios@example.com');
            expect(value.status).toBe('PENDING');
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
          MembershipInvitation.fromUnknown({
            ...validMembershipInvitationObject,
            org: {},
          })
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing with invalid `email`', () => {
        const result = Effect.runSyncExit(
          MembershipInvitation.fromUnknown({
            ...validMembershipInvitationObject,
            email: 'foo',
          })
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing with invalid `status`', () => {
        const result = Effect.runSyncExit(
          MembershipInvitation.fromUnknown({
            ...validMembershipInvitationObject,
            email: 'COMPLICATED',
          })
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `createdAt`', () => {
        const result = Effect.runSyncExit(
          MembershipInvitation.fromUnknown({
            ...validMembershipInvitationObject,
            createdAt: undefined,
          })
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `updatedAt`', () => {
        const result = Effect.runSyncExit(
          MembershipInvitation.fromUnknown({
            ...validMembershipInvitationObject,
            updatedAt: undefined,
          })
        );
        expect(result._tag).toBe('Failure');
      });
    });
  });

  describe('record-to-domain', () => {
    const orgId = faker.string.uuid();
    const invitationId = faker.string.uuid();

    const membershipInvitationRecord = {
      id: invitationId,
      email: 'dimitrios@example.com',
      status: DECLINED,
      role: OWNER,
      created_at: '2012-06-01T12:34:00Z' as const,
      updated_at: '2012-06-01T12:34:00Z' as const,
      org_id: orgId,
    };

    const orgRecord = {
      name: 'Wolfwave',
      id: orgId,
      slug: 'wolfwave',
    };

    it('parses a normal record', () => {
      const result = Effect.runSyncExit(
        MembershipInvitation.fromRecord({
          record: membershipInvitationRecord,
          org: orgRecord,
        })
      );

      Exit.match(result, {
        onFailure: () => fail(),
        onSuccess: (value) => {
          expect(value.id).toBe(invitationId);
          expect(value.role).toBe('OWNER');
          expect(value.createdAt).toStrictEqual(
            new Date('2012-06-01T12:34:00Z')
          );
          expect(value.updatedAt).toStrictEqual(
            new Date('2012-06-01T12:34:00Z')
          );
          expect(value.email).toBe('dimitrios@example.com');
          expect(value.status).toBe('DECLINED');
          expect(value.org).toStrictEqual({
            id: orgId,
            name: 'Wolfwave',
            slug: 'wolfwave',
          });
        },
      });
    });

    it('fails parsing when missing `org`', () => {
      const result = Effect.runSyncExit(
        MembershipInvitation.fromRecord({
          record: membershipInvitationRecord,
          // @ts-expect-error
          org: {},
        })
      );

      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `email`', () => {
      const result = Effect.runSyncExit(
        MembershipInvitation.fromRecord({
          record: {...membershipInvitationRecord, email: ''},
          org: orgRecord,
        })
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `status`', () => {
      const result = Effect.runSyncExit(
        MembershipInvitation.fromRecord({
          // @ts-expect-error
          record: {...membershipInvitationRecord, status: ''},
          org: orgRecord,
        })
      );
      expect(result._tag).toBe('Failure');
    });
  });
});
