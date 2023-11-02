// import {test} from '@japa/runner';

// import {OrgFactory} from '~/database/factories/OrgFactory';
// import {UserFactory} from '~/database/factories/UserFactory';

// import {getOrg} from './getOrg';

// test.group('getOrg', () => {
//   test('should get org details', async ({assert}) => {
//     const org = await OrgFactory.create();
//     const user = await UserFactory.create();
//     await user.related('orgs').attach([org.id]);

//     const {execute} = getOrg();
//     const {users} = await execute(org);

//     assert.isTrue(users.length === 1);
//   });
// });
