import {typedjson} from 'remix-typedjson';

export const respond = {
  ok: {
    data: <ValueType>(data: ValueType) => {
      return typedjson({ok: true, data} as const);
    },
    empty: () => {
      return typedjson({ok: true} as const);
    },
  },
  fail: {
    validation: <ErrorType>(error: ErrorType) => {
      return typedjson({
        ok: false,
        type: 'validation',
        messageObj: error,
      } as const);
    },

    unknown: () => {
      return typedjson({ok: false, type: 'unknown'} as const);
    },
  },
};
