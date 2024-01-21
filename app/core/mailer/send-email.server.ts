import {config} from './config.server.ts';
import {transporter} from './transporter.server.ts';

interface SendEmailProps {
  to: string;
  subject: string;
  content: string;
}

// todo: pass through context
export function sendEmail(props: SendEmailProps) {
  console.log(props);
  return transporter.sendMail({
    from: config.EMAIL_FROM,
    to: props.to,
    subject: props.subject,
    html: props.content,
  });
}
