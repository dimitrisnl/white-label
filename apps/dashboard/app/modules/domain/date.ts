import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

const DateBrand = Symbol.for('DateBrand');

export const dateSchema = Schema.Date.pipe(
  Schema.message(() => 'Date is in invalid format'),
  Schema.brand(DateBrand)
);

export type Date = Schema.Schema.To<typeof dateSchema>;

class ParseDateError {
  readonly _tag = 'ParseDateError';
}

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(dateSchema)(value),
    catch: () => new ParseDateError(),
  });
}
