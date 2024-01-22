import {Effect} from 'effect';

import * as Password from './password.server';

describe('domain/password', () => {
  describe('parsing', () => {
    it('parses a valid password', () => {
      const result = Effect.runSyncExit(Password.parse('my-password-is-ok'));
      expect(result._tag).toBe('Success');
    });
    it('throws on parsing a small password', () => {
      const result = Effect.runSyncExit(Password.parse('1234567'));
      expect(result._tag).toBe('Failure');
    });
    it('throws on parsing a huge password', () => {
      const result = Effect.runSyncExit(Password.parse('12'.repeat(51)));
      expect(result._tag).toBe('Failure');
    });
  });
  describe('hashing', () => {
    it('hashes a password', async () => {
      const password = 'my-password-is-ok';

      const result = await Effect.runPromiseExit(
        Effect.gen(function* (_) {
          const hash = yield* _(Password.hash(password));
          expect(hash).not.toBe(password);
        })
      );
      expect(result._tag).toBe('Success');
    });

    it('has different hashes for the same password', async () => {
      const password = 'my-password-is-ok';

      const result = await Effect.runPromiseExit(
        Effect.gen(function* (_) {
          const hash1 = yield* _(Password.hash(password));
          const hash2 = yield* _(Password.hash(password));
          expect(hash1).not.toBe(hash2);
        })
      );

      expect(result._tag).toBe('Success');
    });
  });

  describe('comparison', () => {
    it('succeeds on correct password', async () => {
      const password = 'my-password-is-ok';

      const result = await Effect.runPromiseExit(
        Effect.gen(function* (_) {
          const hash = yield* _(Password.hash(password));

          const isValid = yield* _(
            Password.compare({
              plainText: password,
              hashValue: hash,
            })
          );

          expect(isValid).toBe(true);
        })
      );

      expect(result._tag).toBe('Success');
    });

    it('fails on incorrect password', async () => {
      const password = 'my-password-is-ok';

      const result = await Effect.runPromiseExit(
        Effect.gen(function* (_) {
          const hash = yield* _(Password.hash(password));

          const isValid = yield* _(
            Password.compare({
              plainText: 'my-password-is-not-ok',
              hashValue: hash,
            })
          );

          expect(isValid).toBe(false);
        })
      );

      expect(result._tag).toBe('Success');
    });
  });
});
