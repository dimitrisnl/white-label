import * as Effect from 'effect/Effect';
import {pipe} from 'effect/Function';

import {addEmailJob} from '~/core/jobs/email-queue.server.ts';

import {config} from '../config.server.ts';

export function sendPasswordResetEmail({
  email,
  passwordResetTokenId,
}: {
  email: string;
  passwordResetTokenId: string;
}) {
  return Effect.gen(function* (_) {
    const html = `
    You requested a password reset\n
    Change your password here: ${config.DASHBOARD_URL}/password/reset-password?token=${passwordResetTokenId}
    `;

    const payload = {
      to: email,
      subject: `Reset your password`,
      content: html,
    };

    yield* _(addEmailJob('password-reset-email', payload));
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
