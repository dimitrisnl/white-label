import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import {Data, Effect} from 'effect';
import {compose, pipe} from 'effect/Function';
import {v4 as uuidv4} from 'uuid';

const UuidBrand = Symbol.for('UuidBrand');

class UUIDGenerationError extends Data.TaggedError('UUIDGenerationError')<{
  cause: ParseError;
}> {}

class UUIDParseError extends Data.TaggedError('UUIDParseError')<{
  cause: ParseError;
}> {}

export const uuidSchema = Schema.UUID.pipe(
  Schema.message(() => 'UUId is in invalid format'),
  Schema.brand(UuidBrand)
);

export type Uuid = Schema.Schema.Type<typeof uuidSchema>;

export const parseUUID = compose(
  Schema.decodeUnknown(uuidSchema),
  Effect.mapError((cause) => new UUIDParseError({cause}))
);

export function generateUUID() {
  return pipe(
    Effect.sync(() => uuidv4()),
    Effect.flatMap(parseUUID),
    Effect.mapError((cause) => new UUIDGenerationError(cause))
  );
}
