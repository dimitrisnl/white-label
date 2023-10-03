import 'dotenv/config';

import * as Schema from '@effect/schema/Schema';
import * as Effect from 'effect/Effect';
import {pipe} from 'effect/Function';
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
const config = Schema.parseSync(envValidationSchema)(process.env);

const transporter = createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_SECURE === 'true',
  auth: {
    user: config.SMTP_USER,
    pass: config.SMTP_PASSWORD,
  },
  pool: true,
});

type MessageContentContent =
  | {type: 'HTML'; message: string}
  | {type: 'PLAIN'; message: string};

interface SendEmailProps {
  to: string;
  subject: string;
  content: MessageContentContent;
}

// todo: add logger
// todo: this is a mess. Quick implementation to include missing email flow
// todo: create templates, dev/testing client, pass through context
export function sendEmail(props: SendEmailProps) {
  const content =
    props.content.type === 'HTML'
      ? {html: props.content.message}
      : {plain: props.content.message};

  return pipe(
    Effect.tryPromise({
      try: () => {
        console.log(props);
        if (process.env.NODE_ENV !== 'production') {
          return Promise.resolve(() => null);
        }
        return transporter
          .sendMail({
            from: config.EMAIL_FROM,
            to: props.to,
            subject: props.subject,
            ...content,
          })
          .then((message) => {
            console.log(message);
            return null;
          });
      },
      catch: (error) => {
        console.log(error);
        return null;
      },
    }),
    Effect.catchAll(() => Effect.succeed(null))
  );
}
