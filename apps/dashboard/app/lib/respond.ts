import {json} from '@remix-run/node';

export const respond = {
  ok: {
    data: <ValueType>(data: ValueType) => {
      return json({ok: true, data} as const);
    },
    empty: () => {
      return json({ok: true} as const);
    },
  },
  fail: {
    validation: <ErrorType>(error: ErrorType) => {
      return json({
        ok: false,
        type: 'validation',
        messageObj: error,
      } as const);
    },

    unknown: () => {
      return json({ok: false, type: 'unknown'} as const);
    },
  },
};
