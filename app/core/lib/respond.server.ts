import {typedjson} from 'remix-typedjson';

export const respond = {
  serverError: () => {
    return typedjson(
      {ok: false as const, errors: ['Something went wrong']},
      {status: 500}
    );
  },
  badRequest: (errors: Array<string>) => {
    return typedjson({ok: false as const, errors}, {status: 400});
  },
  forbidden: (errors: Array<string>) => {
    return typedjson({ok: false as const, errors}, {status: 401});
  },
  redirect: (to: string, init: RequestInit = {}) => {
    return new Response(null, {status: 302, ...init, headers: {Location: to}});
  },
  ok: (data: unknown) => {
    return typedjson({ok: true as const, data});
  },
};
