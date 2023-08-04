import zod from 'zod';
import * as AccessToken from './domain/AccessToken';

export interface RequestData {
  token: string;
}

export interface ResponseData {}

export const validationSchema = zod.object({
  token: AccessToken.tokenIdValidationSchema
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
