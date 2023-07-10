import {test} from '@japa/runner';
import * as E from 'fp-ts/Either';
import {pipe} from 'fp-ts/lib/function';

import {getOrgObj} from '@/database/factories/OrgFactory';
import {UserFactory} from '@/database/factories/UserFactory';

import {createOrg} from './createOrg';

test.group('createOrg', () => {
  test('should create a new org', async ({assert}) => {
    const payload = getOrgObj();

    const user = await UserFactory.create();
    const {execute} = createOrg();
    const result = await execute(payload, user);

    pipe(
      result,
      E.fold(
        (error) => {
          assert.fail(error);
        },
        async (org) => {
          assert.isTrue(org.name === payload.name);

          const membership = await user
            .related('orgs')
            .query()
            .where('org_id', org.id)
            .pivotColumns(['role'])
            .first();

          assert.isTrue(membership?.$extras.pivot_role === 'OWNER');
        }
      )
    );
  });
});
