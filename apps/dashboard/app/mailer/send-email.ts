import * as Effect from 'effect/Effect';
import {pipe} from 'effect/Function';

import {config, transporter} from './transporter';

interface SendEmailProps {
  to: string;
  subject: string;
  content: string;
}

// todo: pass through context
export function sendEmail(props: SendEmailProps) {
  return pipe(
    Effect.tryPromise({
      try: () => {
        return transporter
          .sendMail({
            from: config.EMAIL_FROM,
            to: props.to,
            subject: props.subject,
            html: props.content,
          })
          .then((message) => {
            Effect.log(`Email sent to ${props.to}. Subject: ${props.subject}`);
            // Log the message in development
            if (process.env.NODE_ENV === 'development') {
              console.log(message);
            }
            return null;
          });
      },
      catch: (error) => {
        Effect.log('Error sending email');
        Effect.log(error);
        return null;
      },
    })
  );
}
