import {PasswordResetEmailTemplate} from '@white-label/email-templates';
import * as Effect from 'effect/Effect';
import {pipe} from 'effect/Function';

import {addEmailJob} from '@/queues/email-queue.server';

import {buildTemplate} from '../build-template.server';
import {config} from '../config.server';

export function sendPasswordResetEmail({
  email,
  passwordResetTokenId,
}: {
  email: string;
  passwordResetTokenId: string;
}) {
  return Effect.gen(function* (_) {
    yield* _(Effect.log('Mailer(password-reset-email): Preparing email'));
    // eslint-disable-next-line
    const html = yield* _(
      buildTemplate(
        <PasswordResetEmailTemplate
          dashboardUrl={config.DASHBOARD_URL}
          passwordResetUrl={`${config.DASHBOARD_URL}/password/reset-password?token=${passwordResetTokenId}`}
        />
      )
    );

    const payload = {
      to: email,
      subject: `Reset your password`,
      content: html,
    };

    yield* _(addEmailJob('password-reset-email', payload));
    yield* _(Effect.log('Mailer(password-reset-email): Sending email'));
  }).pipe(
    Effect.catchAll((error) =>
      pipe(
        Effect.log(
          `Mailer(password-reset-email): Failed to send email to ${email}`
        ),
        Effect.flatMap(() => Effect.log(error)),
        // suppress error
        Effect.flatMap(() => Effect.unit)
      )
    )
  );
}
