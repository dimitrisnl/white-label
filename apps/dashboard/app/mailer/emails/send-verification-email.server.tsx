import {VerificationEmailTemplate} from '@white-label/email-templates';
import * as Effect from 'effect/Effect';
import {pipe} from 'effect/Function';

import {addEmailJob} from '@/queues/email-queue.server';

import {buildTemplate} from '../build-template.server';
import {config} from '../config.server';

export function sendVerificationEmail({
  email,
  verifyEmailTokenId,
}: {
  email: string;
  verifyEmailTokenId: string;
}) {
  return Effect.gen(function* (_) {
    yield* _(
      Effect.log(`Mailer(verification-email): Sending email to ${email}`)
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

    const payload = {
      to: email,
      subject: `Verify your email`,
      content: html,
    };

    yield* _(addEmailJob('password-reset-email', payload));
    yield* _(Effect.log(`Mailer(verification-email): Sent email to ${email}`));
  }).pipe(
    Effect.catchAll((error) =>
      pipe(
        Effect.log(
          `Mailer(verification-email): Failed to send email to ${email}`
        ),
        Effect.flatMap(() => Effect.log(error)),
        // suppress error
        Effect.flatMap(() => Effect.unit)
      )
    )
  );
}
