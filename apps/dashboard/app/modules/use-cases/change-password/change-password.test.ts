// import Hash from '@ioc:Adonis/Core/Hash';
// import {test} from '@japa/runner';
// import {E} from '~/utils/fp';
// import {pipe} from 'fp-ts/lib/function';

// import {UserFactory} from '~/database/factories/UserFactory';

// import {changePassword} from './changePassword';

// test.group('changePassword', () => {
//   test('should change password if the old one is correct', async ({assert}) => {
//     const newPassword = 'newPassword';
//     const oldPassword = 'oldPassword';

//     const user = await UserFactory.merge({password: oldPassword}).create();

//     await changePassword().execute(
//       {newPassword, oldPassword: oldPassword},
//       user
//     );

//     const isPasswordValid = await Hash.verify(user.password, newPassword);
//     assert.isTrue(isPasswordValid);
//   });

//   test('should not change password if the old one is incorrect', async ({
//     assert,
//   }) => {
//     const newPassword = 'newPassword';
//     const oldPassword = 'oldPassword';

//     const user = await UserFactory.merge({password: oldPassword}).create();

//     const result = await changePassword().execute(
//       {newPassword, oldPassword: 'wrongPassword'},
//       user
//     );

//     pipe(
//       result,
//       E.fold(
//         (error) => {
//           assert.equal(error, 'IncorrectPasswordError');
//         },
//         () => {
//           assert.fail('Should not have succeeded');
//         }
//       )
//     );
//   });
// });
