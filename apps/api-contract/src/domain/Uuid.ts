import zod from 'zod';

export const validationSchema = zod.string({
  required_error: 'Id is required',
}).uuid({
  message: 'Invalid id',
}).brand('Uuid');

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}

export type Uuid = zod.infer<typeof validationSchema>;
