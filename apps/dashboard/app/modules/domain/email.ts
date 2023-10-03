import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {ValidationError} from '../errors.server';

const emailRegex =
  /^([A-Z0-9_+-]+\.?)*[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i;

const EmailBrand = Symbol.for('EmailBrand');

export const emailSchema = Schema.string.pipe(
  Schema.pattern(emailRegex),
  Schema.brand(EmailBrand)
);
export type Email = Schema.Schema.To<typeof emailSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(emailSchema)(value),
    catch: () => new ValidationError(),
  });
}
