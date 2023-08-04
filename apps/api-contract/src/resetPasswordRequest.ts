import zod from 'zod';
import * as Password from './domain/Password';
import * as AccessToken from './domain/AccessToken';

export interface RequestData {
  token: string;
  password: string;
}

export interface ResponseData {}

export const validationSchema = zod.object({
  password: Password.validationSchema,
  token: AccessToken.tokenIdValidationSchema
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
