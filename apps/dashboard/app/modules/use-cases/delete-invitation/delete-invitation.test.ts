// import {faker} from '@faker-js/faker';
// import {test} from '@japa/runner';
// import {E} from '~/utils/fp';
// import {pipe} from 'fp-ts/lib/function';

// import {Role} from '~/app/constants/Role';
// import {OrgFactory} from '~/database/factories/OrgFactory';

// import {deleteInvitation} from './deleteInvitation';

// test.group('deleteInvitation', () => {
//   test('should be able to delete an invitation', async ({assert}) => {
//     const org = await OrgFactory.create();
//     const invitation = await org.related('membershipInvitations').create({
//       email: faker.internet.email(),
//       role: Role.MEMBER,
//     });

//     const result = await deleteInvitation({
//       invitationAuthorizationService: {
//         authorize: () => Promise.resolve(),
//       },
//     }).execute({invitationId: invitation.id}, org);

//     await org.refresh();
//     const invitations = await org.related('membershipInvitations').query();

//     pipe(
//       result,
//       E.fold(
//         () => assert.fail(),
//         (result) => {
//           assert.isNull(result);
//           assert.equal(invitations.length, 0);
//         }
//       )
//     );
//   });

//   test('should not be able to delete an invitation if not authorized', async ({
//     assert,
//   }) => {
//     const org = await OrgFactory.create();
//     const invitation = await org.related('membershipInvitations').create({
//       email: faker.internet.email(),
//       role: Role.MEMBER,
//     });

//     const result = await deleteInvitation({
//       invitationAuthorizationService: {
//         authorize: () => Promise.reject(),
//       },
//     }).execute({invitationId: invitation.id}, org);

//     await org.refresh();
//     const invitations = await org.related('membershipInvitations').query();

//     pipe(
//       result,
//       E.fold(
//         (error) => {
//           assert.equal(error, 'ForbiddenAction');
//           assert.equal(invitations.length, 1);
//         },
//         () => assert.fail('Should not have succeeded')
//       )
//     );
//   });

//   test('should fail if the invitation does not exist', async ({assert}) => {
//     const org = await OrgFactory.create();

//     const result = await deleteInvitation({
//       invitationAuthorizationService: {
//         authorize: () => Promise.resolve(),
//       },
//     }).execute({invitationId: faker.string.uuid()}, org);

//     pipe(
//       result,
//       E.fold(
//         (error) => {
//           assert.equal(error, 'InvitationNotFound');
//         },
//         () => assert.fail('Should not have succeeded')
//       )
//     );
//   });
// });
