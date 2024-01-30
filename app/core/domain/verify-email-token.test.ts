import {faker} from '@faker-js/faker';
import {Effect} from 'effect';

import {parseVerifyEmailToken} from './verify-email-token.server';

describe('domain/verify-email-token', () => {
  describe('parsing', () => {
    it('parses a valid verify-email-token', () => {
      const result = Effect.runSyncExit(
        parseVerifyEmailToken({
          id: faker.string.uuid(),
          userId: faker.string.uuid(),
          createdAt: '2012-06-01T12:34:00Z',
          updatedAt: '2012-06-01T12:34:00Z',
          expiresAt: '2012-06-01T12:34:00Z',
        })
      );
      expect(result._tag).toBe('Success');
    });
    it('throws on parsing a invalid `id', () => {
      const result = Effect.runSyncExit(
        parseVerifyEmailToken({
          id: faker.string.alphanumeric(),
          userId: faker.string.uuid(),
          createdAt: '2012-06-01T12:34:00Z',
          updatedAt: '2012-06-01T12:34:00Z',
          expiresAt: '2012-06-01T12:34:00Z',
        })
      );
      expect(result._tag).toBe('Failure');
    });
    it('throws on parsing a invalid `user-id', () => {
      const result = Effect.runSyncExit(
        parseVerifyEmailToken({
          id: faker.string.uuid(),
          userId: faker.string.alphanumeric(),
          createdAt: '2012-06-01T12:34:00Z',
          updatedAt: '2012-06-01T12:34:00Z',
          expiresAt: '2012-06-01T12:34:00Z',
        })
      );
      expect(result._tag).toBe('Failure');
    });
  });
});
