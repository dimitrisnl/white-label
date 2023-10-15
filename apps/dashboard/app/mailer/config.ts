import 'dotenv/config';

import * as Schema from '@effect/schema/Schema';

const envValidationSchema = Schema.struct({
  SMTP_HOST: Schema.string.pipe(Schema.minLength(2)),
  SMTP_USER: Schema.string.pipe(Schema.minLength(2)),
  SMTP_PASSWORD: Schema.string.pipe(Schema.minLength(2)),
  SMTP_PORT: Schema.NumberFromString,
  SMTP_SECURE: Schema.string.pipe(Schema.nonEmpty()),

  EMAIL_FROM: Schema.string.pipe(Schema.minLength(5), Schema.endsWith('.com')),
  DASHBOARD_URL: Schema.string.pipe(
    Schema.minLength(5),
    Schema.startsWith('http')
  ),
});

// Throw on-load if missing
export const config = Schema.parseSync(envValidationSchema)(process.env);
