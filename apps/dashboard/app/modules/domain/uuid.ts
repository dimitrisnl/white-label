import * as Effect from 'effect/Effect';
import {v4 as uuidv4} from 'uuid';
import zod from 'zod';

import {UUIDGenerationError, ValidationError} from '../errors.server';

export const validationSchema = zod
  .string({
    required_error: 'Id is required',
  })
  .uuid({
    message: 'Invalid id',
  })
  .brand('Uuid');

export type Uuid = zod.infer<typeof validationSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => validationSchema.parse(value),
    catch: () => new ValidationError(),
  });
}

export function generate() {
  return Effect.gen(function* (_) {
    const id = yield* _(Effect.sync(() => uuidv4()));
    return yield* _(parse(id));
    // no reason for this to fail the parsing
  }).pipe(Effect.catchAll(() => Effect.fail(new UUIDGenerationError())));
}
