import zod from 'zod';
import * as Password from './domain/Password';
import * as Token from './domain/Token';

export interface RequestData {
  token: string;
  password: string;
}

export interface ResponseData {}

export const validationSchema = zod.object({
  password: Password.validationSchema,
  token: Token.tokenIdValidationSchema
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
