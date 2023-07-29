import zod from 'zod';
import * as Token from './domain/Token';

export interface RequestData {
  token: string;
}

export interface ResponseData {}

export const validationSchema = zod.object({
  token: Token.tokenIdValidationSchema
});

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}
