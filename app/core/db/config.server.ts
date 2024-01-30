import * as Schema from '@effect/schema/Schema';

const envValidationSchema = Schema.struct({
  DB_USER: Schema.string.pipe(Schema.minLength(2)),
  DB_HOST: Schema.string.pipe(Schema.minLength(2)),
  DB_NAME: Schema.string.pipe(Schema.minLength(2)),
  DB_PASSWORD: Schema.string.pipe(Schema.minLength(2)),
  DB_PORT: Schema.NumberFromString,
});

// Throw on-load if missing
export const config = Schema.decodeUnknownSync(envValidationSchema)(
  process.env
);
