import {faker} from '@faker-js/faker';
import {Effect} from 'effect';

import {parseInviteStatus} from './invite-status.server';

describe('domain/invite-status', () => {
  describe('parsing', () => {
    it('parses a `PENDING` status', () => {
      const result = Effect.runSyncExit(parseInviteStatus('PENDING'));
      expect(result._tag).toBe('Success');
    });
    it('parses a `DECLINED` status', () => {
      const result = Effect.runSyncExit(parseInviteStatus('DECLINED'));
      expect(result._tag).toBe('Success');
    });
    it('parses a `EXPIRED` status', () => {
      const result = Effect.runSyncExit(parseInviteStatus('EXPIRED'));
      expect(result._tag).toBe('Success');
    });
    it('throws while parsing on other strings', () => {
      const result = Effect.runSyncExit(
        parseInviteStatus(faker.string.alphanumeric())
      );
      expect(result._tag).toBe('Failure');
    });
    it('throws while parsing on empty strings', () => {
      const result = Effect.runSyncExit(parseInviteStatus(''));
      expect(result._tag).toBe('Failure');
    });
  });
});
