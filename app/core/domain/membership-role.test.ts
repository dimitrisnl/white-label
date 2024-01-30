import {faker} from '@faker-js/faker';
import {Effect} from 'effect';

import {parseMembershipRole} from './membership-role.server';

describe('domain/membership-role', () => {
  describe('parsing', () => {
    it('parses a `OWNER` status', () => {
      const result = Effect.runSyncExit(parseMembershipRole('OWNER'));
      expect(result._tag).toBe('Success');
    });
    it('parses a `MEMBER` status', () => {
      const result = Effect.runSyncExit(parseMembershipRole('MEMBER'));
      expect(result._tag).toBe('Success');
    });
    it('parses a `ADMIN` status', () => {
      const result = Effect.runSyncExit(parseMembershipRole('ADMIN'));
      expect(result._tag).toBe('Success');
    });
    it('throws while parsing on other strings', () => {
      const result = Effect.runSyncExit(
        parseMembershipRole(faker.string.alphanumeric())
      );
      expect(result._tag).toBe('Failure');
    });
    it('throws while parsing on empty strings', () => {
      const result = Effect.runSyncExit(parseMembershipRole(''));
      expect(result._tag).toBe('Failure');
    });
  });
});
