// import {test} from '@japa/runner';
// import {E} from '@/utils/fp';
// import {pipe} from 'fp-ts/lib/function';

// import {OrgFactory} from '@/database/factories/OrgFactory';

// import {updateOrg} from './editOrg';

// test.group('updateOrg', () => {
//   test('should update an org', async ({assert}) => {
//     const newName = 'New Name';

//     const org = await OrgFactory.create();
//     const {execute} = updateOrg({
//       orgAuthorizationService: {authorize: () => Promise.resolve()},
//     });

//     const result = await execute({name: newName}, org);

//     pipe(
//       result,
//       E.fold(
//         (error) => {
//           assert.fail(error);
//         },
//         (org) => {
//           assert.isTrue(org.name === newName);
//         }
//       )
//     );
//   });

//   test('should not update an org if not authorized', async ({assert}) => {
//     const org = await OrgFactory.create();
//     const {execute} = updateOrg({
//       orgAuthorizationService: {authorize: () => Promise.reject()},
//     });

//     const result = await execute({name: 'New Name'}, org);

//     pipe(
//       result,
//       E.fold(
//         (error) => {
//           assert.equal(error, 'ForbiddenAction');
//         },
//         () => {
//           assert.fail();
//         }
//       )
//     );
//   });
// });
