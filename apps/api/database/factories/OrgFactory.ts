import {faker} from '@faker-js/faker';
import Factory from '@ioc:Adonis/Lucid/Factory';

import Org from '@/app/modules/org/models/Org';

export function getOrgObj() {
  return {
    name: faker.company.name(),
  };
}

export const OrgFactory = Factory.define(Org, () => {
  return getOrgObj();
}).build();
