// import {faker} from '@faker-js/faker';
// import {test} from '@japa/runner';
// import {E} from '@/utils/fp';
// import {pipe} from 'fp-ts/lib/function';

// import {InviteStatus} from '@/app/constants/InviteStatus';
// import {Role} from '@/app/constants/Role';
// import {OrgFactory} from '@/database/factories/OrgFactory';

// import {declineInvitation} from './declineInvitation';

// test.group('declineInvitation', () => {
//   test('should be able to decline an invitation', async ({assert}) => {
//     const org = await OrgFactory.create();
//     const invitation = await org.related('membershipInvitations').create({
//       email: faker.internet.email(),
//       role: Role.MEMBER,
//     });

//     const result = await declineInvitation().execute(invitation.id);
//     await invitation.refresh();

//     pipe(
//       result,
//       E.fold(
//         () => assert.fail(),
//         () => {
//           assert.isTrue(true);
//           assert.equal(invitation.status, InviteStatus.DECLINED);
//         }
//       )
//     );
//   });

//   test('should not be able to decline an invitation that does not exist', async ({
//     assert,
//   }) => {
//     const result = await declineInvitation().execute(faker.string.uuid());

//     pipe(
//       result,
//       E.fold(
//         (error) => {
//           assert.equal(error, 'InvitationNotFound');
//         },
//         () => {
//           assert.fail();
//         }
//       )
//     );
//   });

//   test('should not be able to decline an invitation that is not pending', async ({
//     assert,
//   }) => {
//     const org = await OrgFactory.create();
//     const invitation = await org.related('membershipInvitations').create({
//       email: faker.internet.email(),
//       role: Role.MEMBER,
//       status: InviteStatus.DECLINED,
//     });

//     const result = await declineInvitation().execute(invitation.id);

//     pipe(
//       result,
//       E.fold(
//         (error) => {
//           assert.equal(error, 'InvitationNotFound');
//         },
//         () => {
//           assert.fail();
//         }
//       )
//     );
//   });
// });
