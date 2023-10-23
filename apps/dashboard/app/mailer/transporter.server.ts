import {createTransport} from 'nodemailer';

import {config} from './config.server.ts';

function makeTransporter() {
  return createTransport({
    host: config.SMTP_HOST,
    port: config.SMTP_PORT,
    secure: config.SMTP_SECURE === 'true',
    auth: {
      user: config.SMTP_USER,
      pass: config.SMTP_PASSWORD,
    },
    pool: true,
  });
}

let transporter: ReturnType<typeof makeTransporter>;

declare global {
  // eslint-disable-next-line no-var
  var __transporter: ReturnType<typeof makeTransporter> | undefined;
}

if (process.env.NODE_ENV === 'production') {
  transporter = makeTransporter();
} else {
  if (!global.__transporter) {
    global.__transporter = makeTransporter();
  }
  transporter = global.__transporter;
}

export {transporter};
