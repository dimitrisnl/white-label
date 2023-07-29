import zod from 'zod';
import * as Password from './domain/Password';

export interface RequestData {
  oldPassword: string;
  newPassword: string;
}

export interface ResponseData {}

export const validationSchema = zod.object({
  oldPassword: Password.validationSchema,
  newPassword: Password.validationSchema,
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
