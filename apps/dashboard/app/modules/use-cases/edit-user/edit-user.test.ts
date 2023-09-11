// import {faker} from '@faker-js/faker';
// import {test} from '@japa/runner';

// import {UserFactory} from '@/database/factories/UserFactory';

// import {editUser} from './editUser';

// test.group('editUser', () => {
//   test('should edit user', async ({assert}) => {
//     const user = await UserFactory.create();
//     const name = faker.person.fullName();

//     const result = await editUser().execute({name}, user);

//     await user.refresh();

//     assert.equal(user.name, result.name);
//   });
// });
