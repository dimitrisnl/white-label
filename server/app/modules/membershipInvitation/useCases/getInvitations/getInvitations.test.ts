import {faker} from '@faker-js/faker';
import {test} from '@japa/runner';
import * as E from 'fp-ts/Either';
import {pipe} from 'fp-ts/lib/function';

import {OrgFactory} from '@/database/factories/OrgFactory';

import {getInvitations} from './getInvitations';

test.group('getInvitations', () => {
  test('should be able to get invitations list', async ({assert}) => {
    const org = await OrgFactory.create();
    await org
      .related('membershipInvitations')
      .createMany([
        {email: faker.internet.email()},
        {email: faker.internet.email()},
      ]);

    const {execute} = getInvitations();
    const result = await execute(org);

    pipe(
      result,
      E.fold(
        () => assert.fail(),
        (invitations) => {
          assert.isArray(invitations);
          assert.lengthOf(invitations, 2);
        }
      )
    );
  });
});
