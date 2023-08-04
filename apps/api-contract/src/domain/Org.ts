import zod from 'zod';
import * as Uuid from './Uuid'
import * as Either from 'fp-ts/Either';

export const orgNameValidationSchema = zod.string({
  required_error: 'Name is required',
}).min(2, {
  message: 'Name must be at least 2 characters',
})

export const validationSchema = zod.object({
  id: Uuid.validationSchema,
  name: orgNameValidationSchema,
  slug: zod.string({
    required_error: 'Slug is required',
  }).min(2, {
    message: 'Slug must be at least 2 characters',
  }),
  createdAt: zod.date(),
  updatedAt: zod.date(),
}).brand('Org')

export type Org = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): Either.Either<Error, Org> {
  return Either.tryCatch(() => validationSchema.parse(value), Either.toError);
}
