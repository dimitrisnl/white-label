import zod from 'zod';
import * as Email from './Email'
import * as Uuid from './Uuid'

export const userNameValidationSchema = zod.string({
  required_error: 'Name is required',
}).min(2, {
  message: 'Name must be at least 2 characters',
})

export const validationSchema = zod.object({
  id: Uuid.validationSchema,
  name: userNameValidationSchema,
  email: Email.validationSchema,
  emailVerified: zod.boolean({
    required_error: 'Email verified is required'
  }),
}).brand('User')

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}

export type User = zod.infer<typeof validationSchema>;