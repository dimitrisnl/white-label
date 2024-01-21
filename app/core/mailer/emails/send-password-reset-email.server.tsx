// import {PasswordResetEmailTemplate} from '@white-label/email-templates/templates/password-reset-email';
import * as Effect from 'effect/Effect';
import {pipe} from 'effect/Function';

import {addEmailJob} from '~/core/jobs/email-queue.server.ts';

import {buildTemplate} from '../build-template.server.tsx';
// import {config} from '../config.server.ts';

export function sendPasswordResetEmail({
  email,
  passwordResetTokenId,
}: {
  email: string;
  passwordResetTokenId: string;
}) {
  return Effect.gen(function* (_) {
    yield* _(Effect.log('Mailer(password-reset-email): Preparing email'));
    console.log({passwordResetTokenId});
    // eslint-disable-next-line
    const html = yield* _(
      buildTemplate()
      // <PasswordResetEmailTemplate
      //   dashboardUrl={config.DASHBOARD_URL}
      //   passwordResetUrl={`${config.DASHBOARD_URL}/password/reset-password?token=${passwordResetTokenId}`}
      // />
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
