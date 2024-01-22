import {faker} from '@faker-js/faker';
import {Effect} from 'effect';

import * as VerifyEmailToken from './verify-email-token.server';

describe('domain/verify-email-token', () => {
  describe('parsing', () => {
    it('parses a valid verify-email-token', () => {
      const result = Effect.runSyncExit(
        VerifyEmailToken.parse({
          id: faker.string.uuid(),
          userId: faker.string.uuid(),
          createdAt: '2024-01-21 16:20:01.150513+00',
          updatedAt: '2024-01-21 16:20:01.150513+00',
          expiresAt: '2024-01-21 16:20:01.150513+00',
        })
      );
      expect(result._tag).toBe('Success');
    });
    it('throws on parsing a invalid `id', () => {
      const result = Effect.runSyncExit(
        VerifyEmailToken.parse({
          id: faker.string.alphanumeric(),
          userId: faker.string.uuid(),
          createdAt: '2024-01-21 16:20:01.150513+00',
          updatedAt: '2024-01-21 16:20:01.150513+00',
          expiresAt: '2024-01-21 16:20:01.150513+00',
        })
      );
      expect(result._tag).toBe('Failure');
    });
    it('throws on parsing a invalid `user-id', () => {
      const result = Effect.runSyncExit(
        VerifyEmailToken.parse({
          id: faker.string.uuid(),
          userId: faker.string.alphanumeric(),
          createdAt: '2024-01-21 16:20:01.150513+00',
          updatedAt: '2024-01-21 16:20:01.150513+00',
          expiresAt: '2024-01-21 16:20:01.150513+00',
        })
      );
      expect(result._tag).toBe('Failure');
    });
  });
});
