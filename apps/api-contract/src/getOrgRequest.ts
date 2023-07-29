import * as Org from './domain/Org';
import * as User from './domain/User';

export interface RequestData {}

export interface ResponseData {
  org: Org.Org;
  users: Array<
    User.User & {
      membership: {
        role: string;
      };
    }
  >;
}
