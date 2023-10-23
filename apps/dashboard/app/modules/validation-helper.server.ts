import * as AST from '@effect/schema/AST';
import * as ParseResult from '@effect/schema/ParseResult';
import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';
import * as E from 'effect/Either';
import {apply, pipe} from 'effect/Function';
import * as Match from 'effect/Match';
import * as Option from 'effect/Option';
import * as ReadonlyArray from 'effect/ReadonlyArray';

import {ValidationError} from '@/modules/errors.server.ts';

type Entry = [string, {readonly message: string}];

const getMessage = AST.getAnnotation<AST.MessageAnnotation<unknown>>(
  AST.MessageAnnotationId
);
const matchError = Match.typeTags<ParseResult.ParseErrors>();

const buildError = (
  error: ParseResult.ParseErrors,
  path = [] as Array<string>
): Array<Entry> =>
  pipe(
    error,
    matchError({
      Key: (err) =>
        ReadonlyArray.flatMap(err.errors, (_) =>
          buildError(_, ReadonlyArray.append(path, String(err.key)))
        ),
      Index: (err) =>
        ReadonlyArray.flatMap(err.errors, (_) =>
          buildError(_, ReadonlyArray.append(path, String(err.index)))
        ),
      UnionMember: (err) =>
        ReadonlyArray.flatMap(err.errors, (_) => buildError(_, path)),
      Type: (_) => [
        [
          ReadonlyArray.join(path, '.'),
          {
            message: pipe(
              _.message,
              Option.orElse(() =>
                Option.map(getMessage(_.expected), apply(_.actual))
              ),
              Option.getOrElse(() =>
                // eslint-disable-next-line
                pipe(Option.getOrElse(() => `Unexpected value: ${_.actual}`))
              )
            ),
          },
        ] as Entry,
      ],
      Missing: () => [
        [ReadonlyArray.join(path, '.'), {message: 'Missing'}] as Entry,
      ],
      Forbidden: () => [
        [ReadonlyArray.join(path, '.'), {message: 'Forbidden'}] as Entry,
      ],
      Unexpected: (_) => [
        [
          ReadonlyArray.join(path, '.'),
          // eslint-disable-next-line
          {message: `Unexpected value: ${_.actual}`},
        ] as Entry,
      ],
    })
  );

export const schemaResolver =
  <I, A>(validationSchema: Schema.Schema<I, A>) =>
  (data: unknown) => {
    const result = Schema.parseEither(validationSchema)(data, {
      errors: 'all',
    });

    if (E.isLeft(result)) {
      const errorMessages = ReadonlyArray.flatMap(result.left.errors, (_) =>
        buildError(_)
      ).map(([, {message}]) => message);
      return Effect.fail(new ValidationError({errors: errorMessages}));
    } else {
      return Effect.succeed(result.right);
    }
  };
