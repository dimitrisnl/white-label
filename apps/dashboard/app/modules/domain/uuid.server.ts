import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';
import {v4 as uuidv4} from 'uuid';

const UuidBrand = Symbol.for('UuidBrand');

class UUIDGenerationError {
  readonly _tag = 'UUIDGenerationError';
}

class ParseUuidError {
  readonly _tag = 'ParseUuidError';
}

export const uuidSchema = Schema.UUID.pipe(
  Schema.message(() => 'UUId is in invalid format'),
  Schema.brand(UuidBrand)
);

export type Uuid = Schema.Schema.To<typeof uuidSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(uuidSchema)(value),
    catch: () => new ParseUuidError(),
  });
}

export function generate() {
  return Effect.gen(function* (_) {
    const id = yield* _(Effect.sync(() => uuidv4()));
    return yield* _(parse(id));
    // no reason for this to fail the parsing
  }).pipe(Effect.catchAll(() => Effect.fail(new UUIDGenerationError())));
}
