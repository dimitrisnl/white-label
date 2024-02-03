import {faker} from '@faker-js/faker';
import {Effect} from 'effect';

import {parseAnnouncementStatus} from './announcement-status.server';

describe('domain/announcement-status', () => {
  describe('parsing', () => {
    it('parses a `DRAFT` status', () => {
      const result = Effect.runSyncExit(parseAnnouncementStatus('DRAFT'));
      expect(result._tag).toBe('Success');
    });
    it('parses a `PUBLISHED` status', () => {
      const result = Effect.runSyncExit(parseAnnouncementStatus('PUBLISHED'));
      expect(result._tag).toBe('Success');
    });
    it('throws while parsing on other strings', () => {
      const result = Effect.runSyncExit(
        parseAnnouncementStatus(faker.string.alphanumeric())
      );
      expect(result._tag).toBe('Failure');
    });
    it('throws while parsing on empty strings', () => {
      const result = Effect.runSyncExit(parseAnnouncementStatus(''));
      expect(result._tag).toBe('Failure');
    });
  });
});
