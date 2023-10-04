import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

const emailRegex =
  /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i;

const EmailBrand = Symbol.for('EmailBrand');

export const emailSchema = Schema.string.pipe(
  Schema.trim,
  Schema.pattern(emailRegex, {
    message: () => 'Email address is invalid',
  }),
  Schema.brand(EmailBrand)
);
export type Email = Schema.Schema.To<typeof emailSchema>;

class ParseEmailError {
  readonly _tag = 'ParseEmailError';
}

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(emailSchema)(value),
    catch: () => new ParseEmailError(),
  });
}
