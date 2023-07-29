import {Org, User} from './domain';

export interface RequestData {}

export interface ResponseData {
  org: Org;
  users: Array<
    User & {
      membership: {
        role: string;
      };
    }
  >;
}
