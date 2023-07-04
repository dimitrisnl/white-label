import {faker} from '@faker-js/faker';
import {test} from '@japa/runner';
import * as E from 'fp-ts/Either';
import {pipe} from 'fp-ts/lib/function';

import {InviteStatus} from '@/app/constants/InviteStatus';
import {Role} from '@/app/constants/Role';
import {OrgFactory} from '@/database/factories/OrgFactory';
import {UserFactory} from '@/database/factories/UserFactory';

import {acceptInvitation} from './acceptInvitation';

test.group('acceptInvitation', () => {
  test('should be able to accept an invitation', async ({assert}) => {
    const org = await OrgFactory.create();
    const invitee = await UserFactory.create();

    const invitation = await org.related('membershipInvitations').create({
      email: faker.internet.email(),
      role: Role.MEMBER,
    });

    const result = await acceptInvitation().execute(invitation.id, invitee);

    await invitation.refresh();
    await invitee.refresh();

    const inviteeMemberships = await invitee.related('orgs').query();

    pipe(
      result,
      E.fold(
        () => assert.fail(),
        () => {
          assert.isTrue(true);
          assert.equal(invitation.status, InviteStatus.ACCEPTED);
          const membership = inviteeMemberships.find(
            (membership) => membership.id === org.id
          );
          assert.equal(membership?.$extras.pivot_role, Role.MEMBER);
        }
      )
    );
  });

  test('should return an error if invitation is not found', async ({
    assert,
  }) => {
    const invitee = await UserFactory.create();

    const result = await acceptInvitation().execute(
      faker.string.uuid(),
      invitee
    );

    pipe(
      result,
      E.fold(
        (error) => {
          assert.equal(error, 'InvitationNotFound');
        },
        () => assert.fail()
      )
    );
  });
});
