import {createTransport} from 'nodemailer';

import {config} from './config';

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
