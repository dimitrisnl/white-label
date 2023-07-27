import {isAxiosError} from 'axios';

export function isRecord(record: unknown): record is Record<string, unknown> {
  return typeof record === 'object' && record !== null;
}

interface responseWithErrorObj {
  response: {
    data: Record<string, unknown>;
  };
}

export function isErrorObject(error: unknown): error is responseWithErrorObj {
  return Boolean(
    isAxiosError(error) && error.response && isRecord(error.response.data)
  );
}
