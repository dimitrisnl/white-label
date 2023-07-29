import zod from 'zod';
import * as User from './domain/User';

export interface RequestData {
  name: string;
}

export interface ResponseData {
  user: User.User;
}

export const validationSchema = zod.object({
  name: User.userNameValidationSchema,
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
