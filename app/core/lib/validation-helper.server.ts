import {formatError} from '@effect/schema/ArrayFormatter';
import * as Schema from '@effect/schema/Schema';
import {pipe} from 'effect';
import * as Effect from 'effect/Effect';

import {ValidationError} from '~/core/lib/errors.server';

export const schemaResolver =
  <I, A>(validationSchema: Schema.Schema<A, I>) =>
  (data: unknown) => {
    return pipe(
      Schema.decodeUnknown(validationSchema)(data, {
        errors: 'all',
      }),
      Effect.mapError((error) => {
        const issue = formatError(error);
        const message = issue[0]!.message;
        return new ValidationError({errors: [message]});
      })
    );
  };
