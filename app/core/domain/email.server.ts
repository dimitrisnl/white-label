import type {ParseError} from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import {Data, Effect} from 'effect';
import {compose} from 'effect/Function';

const emailRegex =
  /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i;

const EmailBrand = Symbol.for('EmailBrand');

export const emailSchema = Schema.compose(Schema.Trim, Schema.Lowercase).pipe(
  Schema.pattern(emailRegex, {
    message: () => 'Email address is invalid',
  }),
  Schema.brand(EmailBrand)
);

export type Email = Schema.Schema.Type<typeof emailSchema>;

class EmailParseError extends Data.TaggedError('EmailParseError')<{
  cause: ParseError;
}> {}

export const parseEmail = compose(
  Schema.decodeUnknown(emailSchema),
  Effect.mapError((cause) => new EmailParseError({cause}))
);
