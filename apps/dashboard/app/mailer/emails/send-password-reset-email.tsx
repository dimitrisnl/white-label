import {PasswordResetEmailTemplate} from '@white-label/email-templates';
import * as Effect from 'effect/Effect';
import {pipe} from 'effect/Function';

import {buildTemplate} from '../build-template';
import {config} from '../config';
import {sendEmail} from '../send-email';

export function sendPasswordResetEmail({
  email,
  passwordResetTokenId,
}: {
  email: string;
  passwordResetTokenId: string;
}) {
  return Effect.gen(function* (_) {
    yield* _(
      Effect.log(
        `Mailer(password-reset-email): Sending password reset email to ${email}`
      )
    );
    // eslint-disable-next-line
    const html = yield* _(
      buildTemplate(
        <PasswordResetEmailTemplate
          dashboardUrl={config.DASHBOARD_URL}
          passwordResetUrl={`${config.DASHBOARD_URL}/password/reset-password?token=${passwordResetTokenId}`}
        />
      )
    );

    yield* _(
      sendEmail({
        to: email,
        subject: `Reset your password`,
        content: html,
      })
    );
    yield* _(
      Effect.log(
        `Mailer(password-reset-email): Sent password reset email to ${email}`
      )
    );
  }).pipe(
    Effect.catchAll((error) =>
      pipe(
        Effect.log(
          `Mailer(password-reset-email): Failed to send password reset email to ${email}`
        ),
        Effect.flatMap(() => Effect.log(error)),
        // suppress error
        Effect.flatMap(() => Effect.unit)
      )
    )
  );
}
