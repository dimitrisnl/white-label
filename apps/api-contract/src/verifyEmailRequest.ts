import zod from 'zod';

export interface RequestData {
  token: string;
}

export interface ResponseData {}

export const validationSchema = zod.object({
  token: zod.string().uuid(),
});

export function validate(data: unknown) {
  return validationSchema.safeParse(data);
}
