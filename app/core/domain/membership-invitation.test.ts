import {faker} from '@faker-js/faker';
import {fail} from 'assert';
import {Effect, Exit} from 'effect';

import * as MembershipInvitation from './membership-invitation.server';

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
      createdAt: '2024-01-21 16:20:01.150513+00',
      updatedAt: '2024-01-21 16:20:01.150513+00',
    };

    describe('parse-membership-invitation', () => {
      it('parses a normal membership-invitation record', () => {
        const result = Effect.runSyncExit(
          MembershipInvitation.parse(validMembershipInvitationObject)
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
              id: invitationId,
              email: 'dimitrios@example.com',
              status: 'PENDING',
              role: 'OWNER',
              createdAt: new Date('2024-01-21 16:20:01.150513+00'),
              updatedAt: new Date('2024-01-21 16:20:01.150513+00'),
            });
          },
        });
      });

      it('fails parsing when missing `org`', () => {
        const result = Effect.runSyncExit(
          MembershipInvitation.parse({
            ...validMembershipInvitationObject,
            org: {},
          })
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing with invalid `email`', () => {
        const result = Effect.runSyncExit(
          MembershipInvitation.parse({
            ...validMembershipInvitationObject,
            email: 'foo',
          })
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing with invalid `status`', () => {
        const result = Effect.runSyncExit(
          MembershipInvitation.parse({
            ...validMembershipInvitationObject,
            email: 'COMPLICATED',
          })
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `createdAt`', () => {
        const result = Effect.runSyncExit(
          MembershipInvitation.parse({
            ...validMembershipInvitationObject,
            createdAt: undefined,
          })
        );
        expect(result._tag).toBe('Failure');
      });

      it('fails parsing when missing `updatedAt`', () => {
        const result = Effect.runSyncExit(
          MembershipInvitation.parse({
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
      status: 'DECLINED',
      role: 'OWNER',
      created_at: '2024-01-21 16:20:01.150513+00',
      updated_at: '2024-01-21 16:20:01.150513+00',
    };

    const orgRecord = {
      name: 'Wolfwave',
      id: orgId,
      slug: 'wolfwave',
    };

    it('parses a normal record', () => {
      const result = Effect.runSyncExit(
        MembershipInvitation.dbRecordToDomain(
          membershipInvitationRecord,
          orgRecord
        )
      );

      Exit.match(result, {
        onFailure: () => fail(),
        onSuccess: (value) => {
          expect(value).toStrictEqual({
            id: invitationId,
            role: 'OWNER',
            createdAt: new Date('2024-01-21 16:20:01.150513+00'),
            updatedAt: new Date('2024-01-21 16:20:01.150513+00'),
            email: 'dimitrios@example.com',
            status: 'DECLINED',
            org: {
              id: orgId,
              name: 'Wolfwave',
              slug: 'wolfwave',
            },
          });
        },
      });
    });

    it('fails parsing when missing `org`', () => {
      const result = Effect.runSyncExit(
        // @ts-expect-error
        MembershipInvitation.dbRecordToDomain(membershipInvitationRecord, {})
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `email`', () => {
      const result = Effect.runSyncExit(
        MembershipInvitation.dbRecordToDomain(
          {...membershipInvitationRecord, email: ''},
          orgRecord
        )
      );
      expect(result._tag).toBe('Failure');
    });

    it('fails parsing when missing `status`', () => {
      const result = Effect.runSyncExit(
        MembershipInvitation.dbRecordToDomain(
          {...membershipInvitationRecord, status: ''},
          orgRecord
        )
      );
      expect(result._tag).toBe('Failure');
    });
  });
});
