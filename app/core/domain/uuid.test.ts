import {faker} from '@faker-js/faker';
import {Effect} from 'effect';

import * as Uuid from './uuid.server';

// todo: Pass `uuid` as a Service through Effect.Layer
// Makes it easier to make the external service fail, and test our error handling

describe('domain/uuid', () => {
  describe('parsing', () => {
    it('parses a uuid', () => {
      const result = Effect.runSyncExit(Uuid.parse(faker.string.uuid()));
      expect(result._tag).toBe('Success');
    });
    it('throws while parsing other strings', () => {
      const result = Effect.runSyncExit(Uuid.parse(faker.string.nanoid()));
      expect(result._tag).toBe('Failure');
    });
  });
  describe('generation', () => {
    it('generates a new uuid', () => {
      const result = Effect.runSyncExit(Uuid.generate());
      expect(result._tag).toBe('Success');
    });
  });
});
