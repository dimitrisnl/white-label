import {VerificationEmailTemplate} from '@white-label/email-templates';
import * as Effect from 'effect/Effect';

import {buildTemplate} from '../build-template';
import {sendEmail} from '../send-email';

export function sendVerificationEmail({
  email,
  verifyEmailTokenId,
}: {
  email: string;
  verifyEmailTokenId: string;
}) {
  return Effect.gen(function* (_) {
    // eslint-disable-next-line
    const html = yield* _(
      buildTemplate(
        <VerificationEmailTemplate
          verificationUrl={`http://localhost:3000/email/verify?token=${verifyEmailTokenId}`}
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
  }).pipe(
    Effect.catchAll(() => {
      Effect.log(`Failed to send welcome email`);
      return Effect.unit;
    })
  );
}
