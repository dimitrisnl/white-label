import zod from 'zod';
import {v4 as uuidv4} from 'uuid';
import * as Either from 'fp-ts/Either';

export const validationSchema = zod.string({
  required_error: 'Id is required',
}).uuid({
  message: 'Invalid id',
}).brand('Uuid');

export type Uuid = zod.infer<typeof validationSchema>;

export function validate(data: Record<string, any>) {
  return validationSchema.safeParse(data);
}

export function parse(value: unknown): Either.Either<Error, Uuid> {
  return Either.tryCatch(() => validationSchema.parse(value), Either.toError);
}

export function create() {
  const uuid = uuidv4();
  return parse(uuid);
}
