import zod from 'zod';
import * as Email from './Email'
import * as Uuid from './Uuid'
import * as Either from 'fp-ts/Either';

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
  createdAt: zod.date(),
  updatedAt: zod.date(),
}).brand('User')

export type User = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): Either.Either<Error, User> {
  return Either.tryCatch(() => validationSchema.parse(value), Either.toError);
}

