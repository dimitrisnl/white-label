import zod from 'zod';
import * as Email from './domain/Email';

export interface RequestData {
  email: string;
}

export interface ResponseData {}

export const validationSchema = zod.object({
  email: Email.validationSchema,
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
