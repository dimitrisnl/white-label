import * as Token from './domain/Token';
import * as Email from './domain/Email';
import * as Password from './domain/Password';

import zod from 'zod';

export interface RequestData {
  email: string;
  password: string;
}

export interface ResponseData {
  token: Token.Token;
}

export const validationSchema = zod.object({
  email: Email.validationSchema,
  password: Password.validationSchema
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
