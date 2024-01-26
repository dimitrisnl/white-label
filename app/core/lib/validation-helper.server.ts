import {formatIssue} from '@effect/schema/ArrayFormatter';
import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';
import * as E from 'effect/Either';

import {ValidationError} from '~/core/lib/errors.server';

export const schemaResolver =
  <I, A>(validationSchema: Schema.Schema<I, A>) =>
  (data: unknown) => {
    const result = Schema.parseEither(validationSchema)(data, {
      errors: 'all',
    });

    if (E.isLeft(result)) {
      const issue = formatIssue(result.left.error);
      // @ts-expect-error
      const message = issue[0].message as unknown as string;

      return Effect.fail(new ValidationError({errors: [message]}));
    } else {
      return Effect.succeed(result.right);
    }
  };
