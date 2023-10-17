import type {ActionFunctionArgs} from '@remix-run/node';
import * as Context from 'effect/Context';
import * as Effect from 'effect/Effect';
import {pipe} from 'effect/Function';
import {redirect, typedjson} from 'remix-typedjson';

import type {HttpResponse, HttpResponseError} from './responses.server.ts';
import {matchHttpResponse, matchHttpResponseError} from './responses.server.ts';

export const ActionArgs = Context.Tag<ActionFunctionArgs>('ActionArgs');

// Don't throw the Error requests, handle them in the normal UI. No ErrorBoundary
export const withAction =
  <T>(
    self: Effect.Effect<ActionFunctionArgs, HttpResponseError, HttpResponse<T>>
  ) =>
  (args: ActionFunctionArgs) => {
    const runnable = pipe(
      self,
      Effect.provideService(ActionArgs, args),
      Effect.match({
        onFailure: matchHttpResponseError()({
          Redirect: ({to, init}) => {
            return redirect(to, init);
          },
          BadRequest: ({errors}) => {
            return typedjson({ok: false as const, errors}, {status: 400});
          },
          ServerError: ({errors = ['Something went wrong']}) => {
            return typedjson({ok: false as const, errors}, {status: 500});
          },
          Forbidden: ({errors}) => {
            return typedjson({ok: false as const, errors}, {status: 401});
          },
        }),
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

    return Effect.runPromise(runnable);
  };
