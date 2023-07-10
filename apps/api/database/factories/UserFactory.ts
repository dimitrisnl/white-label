import {faker} from '@faker-js/faker';
import Factory from '@ioc:Adonis/Lucid/Factory';

import User from '@/app/modules/user/models/User';

export function getUserObj() {
  return {
    name: faker.person.fullName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    emailVerified: false,
  };
}

export const UserFactory = Factory.define(User, () => {
  return getUserObj();
}).build();
