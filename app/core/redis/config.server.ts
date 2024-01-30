import * as Schema from '@effect/schema/Schema';

const envValidationSchema = Schema.struct({
  REDIS_HOST: Schema.string.pipe(Schema.minLength(2)),
  REDIS_PASSWORD: Schema.string,
  REDIS_USER: Schema.string,
  REDIS_PORT: Schema.NumberFromString,
  REDIS_TLS: Schema.string,
});

// Throw on-load if missing
export const config = Schema.decodeUnknownSync(envValidationSchema)(
  process.env
);
