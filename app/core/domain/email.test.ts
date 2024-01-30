import {fail} from 'assert';
import {Effect, Exit} from 'effect';

import {parseEmail} from './email.server';

describe('domain/email', () => {
  describe('parsing', () => {
    it('parses a valid email', () => {
      const result = Effect.runSyncExit(parseEmail('example@example.com'));
      expect(result._tag).toBe('Success');
    });
    it('parses a valid email and converts to lowercase', () => {
      const result = Effect.runSyncExit(parseEmail('EXAMPLE@EXAMPLE.COM'));

      Exit.match(result, {
        onFailure: () => fail(),
        onSuccess: (value) => {
          expect(value).toBe('example@example.com');
        },
      });
    });
    it('parses a valid email and trims whitespace', () => {
      const result = Effect.runSyncExit(parseEmail(' example@example.com '));
      expect(result._tag).toBe('Success');

      Exit.match(result, {
        onFailure: () => fail(),
        onSuccess: (value) => {
          expect(value).toBe('example@example.com');
        },
      });
    });
    it('throws on parsing a invalid email', () => {
      const result = Effect.runSyncExit(parseEmail('example.com'));
      expect(result._tag).toBe('Failure');
    });
  });
});
