import {VerificationEmailTemplate} from '@white-label/email-templates';
import * as Effect from 'effect/Effect';
import {pipe} from 'effect/Function';

import {buildTemplate} from '../build-template.server';
import {config} from '../config.server';
import {sendEmail} from '../send-email.server';

export function sendVerificationEmail({
  email,
  verifyEmailTokenId,
}: {
  email: string;
  verifyEmailTokenId: string;
}) {
  return Effect.gen(function* (_) {
    yield* _(
      Effect.log(
        `Mailer(verification-email): Sending verification email to ${email}`
      )
    );
    // eslint-disable-next-line
    const html = yield* _(
      buildTemplate(
        <VerificationEmailTemplate
          dashboardUrl={config.DASHBOARD_URL}
          verificationUrl={`${config.DASHBOARD_URL}/email/verify-email?token=${verifyEmailTokenId}`}
        />
      )
    );

    yield* _(
      sendEmail({
        to: email,
        subject: 'Welcome to White Label',
        content: html,
      })
    );
    yield* _(
      Effect.log(
        `Mailer(verification-email): Sent verification email to ${email}`
      )
    );
  }).pipe(
    Effect.catchAll((error) =>
      pipe(
        Effect.log(
          `Mailer(verification-email): Failed to send verification email to ${email}`
        ),
        Effect.flatMap(() => Effect.log(error)),
        // suppress error
        Effect.flatMap(() => Effect.unit)
      )
    )
  );
}
