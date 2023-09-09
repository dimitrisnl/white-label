import type {LoaderArgs as RemixLoaderArgs} from '@remix-run/node';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import * as Exit from 'effect/Exit';
import {pipe} from 'effect/Function';
import {redirect, typedjson} from 'remix-typedjson';

import type {HttpResponse, HttpResponseError} from './responses.server';
import {matchHttpResponse, matchHttpResponseError} from './responses.server';

export const LoaderArgs = Context.Tag<RemixLoaderArgs>('LoaderArgs');

// Respond with OK, Redirect
// Throw all else, and land on a ErrorBoundary
export const withLoader =
  <T>(
    self: Effect.Effect<RemixLoaderArgs, HttpResponseError, HttpResponse<T>>
  ) =>
  (args: RemixLoaderArgs) => {
    const runnable = pipe(self, Effect.provideService(LoaderArgs, args));

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
