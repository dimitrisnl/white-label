import {Effect} from 'effect';

import * as Date from './date.server';

describe('domain/date', () => {
  describe('parsing', () => {
    it('parses a valid date', () => {
      // todo: fix this format
      const result = Effect.runSyncExit(
        Date.parse('2024-01-21 16:06:47.255687+00')
      );
      expect(result._tag).toBe('Success');
    });
    it('throws while parsing an invalid date', () => {
      const result = Effect.runSyncExit(Date.parse('foo'));
      expect(result._tag).toBe('Failure');
    });
  });
});
