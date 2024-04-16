import * as Schema from '@effect/schema/Schema';

const envValidationSchema = Schema.Struct({
  REDIS_HOST: Schema.String.pipe(Schema.minLength(2)),
  REDIS_PASSWORD: Schema.String,
  REDIS_USER: Schema.String,
  REDIS_PORT: Schema.NumberFromString,
  REDIS_TLS: Schema.String,
});

// Throw on-load if missing
export const config = Schema.decodeUnknownSync(envValidationSchema)(
  process.env
);
