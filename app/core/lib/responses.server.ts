import * as Data from 'effect/Data';
import * as Match from 'effect/Match';

export class Ok<T> extends Data.TaggedClass('Ok')<{
  readonly data: T;
}> {}

export class Redirect extends Data.TaggedClass('Redirect')<{
  readonly to: string;
  readonly init?: ResponseInit;
}> {}

export class Forbidden extends Data.TaggedClass('Forbidden')<{
  readonly errors: Array<string>;
}> {}

export class BadRequest extends Data.TaggedClass('BadRequest')<{
  readonly errors: Array<string>;
}> {}

export class ServerError extends Data.TaggedClass('ServerError')<{
  readonly errors?: Array<string>;
}> {}

export type HttpResponse<T> = Redirect | Ok<T>;
export const matchHttpResponse = <T>() => Match.typeTags<HttpResponse<T>>();

export type HttpResponseError = BadRequest | Redirect | ServerError | Forbidden;
export const matchHttpResponseError = () => Match.typeTags<HttpResponseError>();
