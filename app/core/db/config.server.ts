import * as Schema from '@effect/schema/Schema';

const envValidationSchema = Schema.Struct({
  DB_USER: Schema.String.pipe(Schema.minLength(2)),
  DB_HOST: Schema.String.pipe(Schema.minLength(2)),
  DB_NAME: Schema.String.pipe(Schema.minLength(2)),
  DB_PASSWORD: Schema.String.pipe(Schema.minLength(2)),
  DB_PORT: Schema.NumberFromString,
});

// Throw on-load if missing
export const config = Schema.decodeUnknownSync(envValidationSchema)(
  process.env
);
