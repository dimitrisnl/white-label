// import {faker} from '@faker-js/faker';
// import Mail from '@ioc:Adonis/Addons/Mail';
// import {test} from '@japa/runner';
// import {E} from '@/utils/fp';
// import {pipe} from 'fp-ts/lib/function';

// import {Role} from '@/app/constants/Role';
// import {OrgFactory} from '@/database/factories/OrgFactory';

// import {createInvitation} from './createInvitation';

// test.group('createInvitation', () => {
//   test('should be able to create an invitation', async ({assert}) => {
//     const props = {
//       email: faker.internet.email(),
//       role: Role.OWNER,
//     };
//     const org = await OrgFactory.create();

//     const result = await createInvitation({
//       invitationAuthorizationService: {authorize: () => Promise.resolve()},
//     }).execute(props, org);

//     pipe(
//       result,
//       E.fold(
//         () => assert.fail(),
//         (result) => {
//           assert.isObject(result);
//           assert.equal(result.email, props.email);
//           assert.equal(result.role, props.role);
//         }
//       )
//     );
//   });

//   test('should not be able to create an invitation if not authorized', async ({
//     assert,
//   }) => {
//     const props = {
//       email: faker.internet.email(),
//       role: Role.OWNER,
//     };
//     const org = await OrgFactory.create();

//     const result = await createInvitation({
//       invitationAuthorizationService: {
//         authorize: () => Promise.reject(),
//       },
//     }).execute(props, org);

//     pipe(
//       result,
//       E.fold(
//         (error) => {
//           assert.equal(error, 'ForbiddenAction');
//         },
//         () => assert.fail()
//       )
//     );
//   });

//   test('should send an invitation email', async ({assert}) => {
//     const mailer = Mail.fake();

//     const props = {
//       email: faker.internet.email(),
//       role: Role.OWNER,
//     };
//     const org = await OrgFactory.create();

//     await createInvitation({
//       invitationAuthorizationService: {
//         authorize: () => Promise.resolve(),
//       },
//     }).execute(props, org);

//     assert.isTrue(
//       mailer.exists((mail) => {
//         if (!mail.to) {
//           return false;
//         }
//         return mail.to[0].address === props.email;
//       })
//     );

//     Mail.restore();
//   });

//   test('should not be able to create an invitation if invitee already exists', async ({
//     assert,
//   }) => {
//     const props = {
//       email: faker.internet.email(),
//       role: Role.OWNER,
//     };
//     const org = await OrgFactory.create();

//     await createInvitation({
//       invitationAuthorizationService: {
//         authorize: () => Promise.resolve(),
//       },
//     }).execute(props, org);

//     const result = await createInvitation({
//       invitationAuthorizationService: {
//         authorize: () => Promise.resolve(),
//       },
//     }).execute(props, org);

//     pipe(
//       result,
//       E.fold(
//         (error) => {
//           assert.equal(error, 'InviteeExists');
//         },
//         () => assert.fail()
//       )
//     );
//   });
// });
