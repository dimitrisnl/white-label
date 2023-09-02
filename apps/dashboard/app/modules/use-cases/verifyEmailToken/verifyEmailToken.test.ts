// import {faker} from '@faker-js/faker';
// import {test} from '@japa/runner';
// import {pipe} from 'fp-ts/lib/function';
// import {DateTime} from 'luxon';

// import {UserFactory} from '@/database/factories/UserFactory';
// import {E} from '@/utils/fp';

// import {getVerifyEmailService} from '../../services/verifyEmailService';
// import {verifyEmail} from './verifyEmailToken';

// test.group('verifyEmail', () => {
//   test('should verify email if token belongs to user ', async ({assert}) => {
//     const user = await UserFactory.create();
//     const token = await user.related('verifyEmailToken').create({
//       expiresAt: DateTime.now().plus({hour: 1}),
//     });

//     await verifyEmail({
//       verifyEmailService: getVerifyEmailService(),
//     }).execute({
//       token: token.id,
//     });

//     await user.refresh();

//     assert.isTrue(user.emailVerified);
//   });

//   test('should not verify email if token does not belong to user', async ({
//     assert,
//   }) => {
//     const result = await verifyEmail({
//       verifyEmailService: getVerifyEmailService(),
//     }).execute({
//       token: faker.string.uuid(),
//     });

//     pipe(
//       result,
//       E.fold(
//         (error) => {
//           assert.equal(error, 'InvalidTokenError');
//         },
//         () => {
//           assert.fail('Should not have succeeded');
//         }
//       )
//     );
//   });
// });
