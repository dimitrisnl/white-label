import {faker} from '@faker-js/faker';
import {Effect} from 'effect';

import {generateUUID, parseUUID} from './uuid.server';

describe('domain/uuid', () => {
  describe('parsing', () => {
    it('parses a uuid', () => {
      const result = Effect.runSyncExit(parseUUID(faker.string.uuid()));
      expect(result._tag).toBe('Success');
    });
    it('throws while parsing other strings', () => {
      const result = Effect.runSyncExit(parseUUID(faker.string.nanoid()));
      expect(result._tag).toBe('Failure');
    });
  });
  describe('generation', () => {
    it('generates a new uuid', () => {
      const result = Effect.runSyncExit(generateUUID());
      expect(result._tag).toBe('Success');
    });
  });
});
