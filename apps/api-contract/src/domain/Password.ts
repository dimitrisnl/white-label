import zod from 'zod';

export const validationSchema = zod.string({
  required_error: 'Password is required',
}).min(8, {
  message: 'Password must be at least 8 characters',
}).brand('Password');

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}

export type Password = zod.infer<typeof validationSchema>;