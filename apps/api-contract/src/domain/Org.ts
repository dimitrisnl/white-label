import zod from 'zod';
import * as Uuid from './Uuid'

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
}).brand('Org')

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}


export type Org = zod.infer<typeof validationSchema>;