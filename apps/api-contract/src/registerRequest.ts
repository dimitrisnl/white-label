import zod from 'zod';
import * as Password from './domain/Password';
import * as Token from './domain/Token';
import * as User from './domain/User';
import * as Email from './domain/Email';


export interface RequestData {
  name: string;
  email: string;
  password: string;
}

export interface ResponseData {
  token: Token.Token;
  user: User.User;
}

export const validationSchema = zod.object({
  email: Email.validationSchema,
  password: Password.validationSchema,
  name: User.userNameValidationSchema,
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
