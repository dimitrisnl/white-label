import type {LoaderFunctionArgs} from '@remix-run/node';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Exit from 'effect/Exit';
import {pipe} from 'effect/Function';
import * as Logger from 'effect/Logger';
import * as LogLevel from 'effect/LogLevel';
import {redirect, typedjson} from 'remix-typedjson';

import type {
  HttpResponse,
  HttpResponseError,
} from '~/modules/responses.server.ts';
import {
  matchHttpResponse,
  matchHttpResponseError,
} from '~/modules/responses.server.ts';

export const LoaderArgs = Context.Tag<LoaderFunctionArgs>('LoaderArgs');

// Respond with OK, Redirect
// Throw all else, and land on a ErrorBoundary
export const withLoader =
  <T>(
    self: Effect.Effect<LoaderFunctionArgs, HttpResponseError, HttpResponse<T>>
  ) =>
  (args: LoaderFunctionArgs) => {
    const runnable = pipe(
      self,
      Logger.withMinimumLogLevel(LogLevel.None),
      Effect.provideService(LoaderArgs, args)
    );

    return Effect.runPromiseExit(runnable).then(
      Exit.match({
        onFailure: (cause) => {
          console.log(cause);
          if (cause._tag === 'Fail') {
            throw pipe(
              cause.error,
              matchHttpResponseError()({
                Redirect: ({to, init}) => {
                  return redirect(to, init);
                },
                BadRequest: ({errors}) => {
                  return typedjson({ok: false as const, errors}, {status: 400});
                },
                ServerError: ({errors}) => {
                  return typedjson({ok: false as const, errors}, {status: 500});
                },
                Forbidden: ({errors}) => {
                  return typedjson({ok: false as const, errors}, {status: 401});
                },
              })
            );
          }

          throw typedjson(
            {ok: false as const, errors: ['Something went wrong']},
            {status: 500}
          );
        },
        onSuccess: matchHttpResponse<T>()({
          Ok: ({data}) => {
            return typedjson({ok: true as const, data});
          },
          Redirect: ({to, init = {}}) => {
            return redirect(to, init);
          },
        }),
      })
    );
  };
