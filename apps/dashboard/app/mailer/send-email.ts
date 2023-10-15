import * as Effect from 'effect/Effect';

import {config} from './config';
import {transporter} from './transporter';

interface SendEmailProps {
  to: string;
  subject: string;
  content: string;
}

// todo: pass through context
export function sendEmail(props: SendEmailProps) {
  return Effect.tryPromise(() => {
    return transporter.sendMail({
      from: config.EMAIL_FROM,
      to: props.to,
      subject: props.subject,
      html: props.content,
    });
  });
}
