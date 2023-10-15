import 'dotenv/config';

import * as Schema from '@effect/schema/Schema';
import {createTransport} from 'nodemailer';

const envValidationSchema = Schema.struct({
  SMTP_HOST: Schema.string.pipe(Schema.minLength(2)),
  SMTP_USER: Schema.string.pipe(Schema.minLength(2)),
  SMTP_PASSWORD: Schema.string.pipe(Schema.minLength(2)),
  SMTP_PORT: Schema.NumberFromString,
  SMTP_SECURE: Schema.string.pipe(Schema.nonEmpty()),

  EMAIL_FROM: Schema.string.pipe(Schema.minLength(5), Schema.endsWith('.com')),
});

// Throw on-load if missing
export const config = Schema.parseSync(envValidationSchema)(process.env);

export const transporter = createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_SECURE === 'true',
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASSWORD,
  },
  pool: true,
});
