import * as Schema from '@effect/schema/Schema';

const envValidationSchema = Schema.Struct({
  SMTP_HOST: Schema.String.pipe(Schema.minLength(2)),
  SMTP_USER: Schema.String.pipe(Schema.minLength(2)),
  SMTP_PASSWORD: Schema.String.pipe(Schema.minLength(2)),
  SMTP_PORT: Schema.NumberFromString,
  SMTP_SECURE: Schema.String.pipe(Schema.nonEmpty()),

  EMAIL_FROM: Schema.String.pipe(Schema.minLength(5), Schema.endsWith('.com')),
  DASHBOARD_URL: Schema.String.pipe(
    Schema.minLength(5),
    Schema.startsWith('http')
  ),
});

// Throw on-load if missing
export const config = Schema.decodeUnknownSync(envValidationSchema)(
  process.env
);
