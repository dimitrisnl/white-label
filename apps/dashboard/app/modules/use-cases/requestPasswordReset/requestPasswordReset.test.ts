// import Mail from '@ioc:Adonis/Addons/Mail';
// import {test} from '@japa/runner';
// import {E} from '@/utils/fp';
// import {pipe} from 'fp-ts/lib/function';

// import {UserFactory} from '@/database/factories/UserFactory';

// import {getPasswordResetService} from '../../services/passwordResetService';
// import {requestPasswordReset} from './requestPasswordReset';

// test.group('requestPasswordReset', () => {
//   test('should send password reset email', async ({assert}) => {
//     const user = await UserFactory.create();
//     const mailer = Mail.fake();

//     // 1. No token exists
//     let token = await user.related('passwordResetToken').query().first();
//     assert.isNull(token);

//     // 2. User requests password reset
//     await requestPasswordReset({
//       passwordResetService: getPasswordResetService(),
//     }).execute({
//       email: user.email,
//     });

//     // 3. Token exists
//     token = await user.related('passwordResetToken').query().first();
//     assert.isNotNull(token);

//     // 4. Email was sent
//     assert.isTrue(
//       mailer.exists((mail) => {
//         if (!mail.to) {
//           return false;
//         }
//         return mail.to[0].address === user.email;
//       })
//     );

//     Mail.restore();
//   });

//   test('should not send password reset email if user does not exist', async ({
//     assert,
//   }) => {
//     // 1. User does not exist
//     const result = await requestPasswordReset({
//       passwordResetService: getPasswordResetService(),
//     }).execute({
//       email: 'foo@foo.com',
//     });

//     pipe(
//       result,
//       E.fold(
//         (error) => {
//           assert.equal(error, 'UserNotFoundError');
//         },
//         () => {
//           assert.fail('Should not have succeeded');
//         }
//       )
//     );
//   });
// });
