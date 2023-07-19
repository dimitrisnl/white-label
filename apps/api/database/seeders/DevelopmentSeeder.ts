import {faker} from '@faker-js/faker';
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';

import {Role} from '@/app/constants/Role';
import Org from '@/app/modules/org/models/Org';
import User from '@/app/modules/user/models/User';

function getRole() {
  const enumValues = Object.values(Role);
  const index = Math.floor(Math.random() * enumValues.length);
  return enumValues[index];
}

function createUser() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: '123123123',
  };
}

function createInvitation() {
  return {
    email: faker.internet.email(),
    role: getRole(),
  };
}

export default class DevelopmentSeeder extends BaseSeeder {
  static environment = ['development'];

  async run() {
    const orgs = await Org.createMany([
      {name: faker.company.name()},
      {name: faker.company.name()},
      {name: faker.company.name()},
    ]);

    const users = await User.createMany(Array.from({length: 12}, createUser));

    for (const user of users) {
      await user.related('orgs').attach(orgs.map((org) => org.id));
    }

    for (const org of orgs) {
      await org
        .related('membershipInvitations')
        .createMany(Array.from({length: 5}, createInvitation));
    }
  }
}
