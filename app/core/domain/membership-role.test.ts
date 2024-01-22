import {faker} from '@faker-js/faker';
import {Effect} from 'effect';

import * as MembershipRole from './membership-role.server';

describe('domain/membership-role', () => {
  describe('parsing', () => {
    it('parses a `OWNER` status', () => {
      const result = Effect.runSyncExit(MembershipRole.parse('OWNER'));
      expect(result._tag).toBe('Success');
    });
    it('parses a `MEMBER` status', () => {
      const result = Effect.runSyncExit(MembershipRole.parse('MEMBER'));
      expect(result._tag).toBe('Success');
    });
    it('parses a `ADMIN` status', () => {
      const result = Effect.runSyncExit(MembershipRole.parse('ADMIN'));
      expect(result._tag).toBe('Success');
    });
    it('throws while parsing on other strings', () => {
      const result = Effect.runSyncExit(
        MembershipRole.parse(faker.string.alphanumeric())
      );
      expect(result._tag).toBe('Failure');
    });
    it('throws while parsing on empty strings', () => {
      const result = Effect.runSyncExit(MembershipRole.parse(''));
      expect(result._tag).toBe('Failure');
    });
  });
});
