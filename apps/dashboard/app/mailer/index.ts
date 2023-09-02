import 'dotenv/config';

import * as Effect from 'effect/Effect';
import {pipe} from 'effect/Function';
import {createTransport} from 'nodemailer';
import zod from 'zod';

const envValidationSchema = zod.object({
  SMTP_HOST: zod.string().min(2),
  SMTP_SECURE: zod.coerce.boolean(),
  SMTP_USER: zod.string().min(2),
  SMTP_PASSWORD: zod.string().min(2),
  SMTP_PORT: zod.coerce.number(),
  //
  EMAIL_FROM: zod.string().min(2),
});

// Throw on-load if missing
const config = envValidationSchema.parse(process.env);

const transporter = createTransport({
  host: config.SMTP_HOST,
  port: config.SMTP_PORT,
  secure: config.SMTP_SECURE,
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
