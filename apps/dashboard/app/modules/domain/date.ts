import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';

import {ValidationError} from '../errors.server';

const DateBrand = Symbol.for('DateBrand');

export const dateSchema = Schema.Date.pipe(Schema.brand(DateBrand));

export type Date = Schema.Schema.To<typeof dateSchema>;

export function parse(value: unknown) {
  return Effect.try({
    try: () => Schema.parseSync(dateSchema)(value),
    catch: () => new ValidationError(),
  });
}
