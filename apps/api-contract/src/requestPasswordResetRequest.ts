import zod from 'zod';

export interface RequestData {
  email: string;
}

export interface ResponseData {}

export const validationSchema = zod.object({
  email: zod.string().email(),
});

export function validate(data: unknown) {
  return validationSchema.safeParse(data);
}
