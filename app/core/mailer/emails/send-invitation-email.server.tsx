import * as Effect from 'effect/Effect';
import {pipe} from 'effect/Function';

import {addEmailJob} from '~/core/jobs/email-queue.server.ts';

import {config} from '../config.server.ts';

export function sendInvitationEmail({
  email,
  orgName,
  invitationTokenId,
}: {
  email: string;
  orgName: string;
  invitationTokenId: string;
}) {
  return Effect.gen(function* (_) {
    const html = `
    You've been invited to join ${orgName}!\n
    Accept your invitation by creating a new account: ${config.DASHBOARD_URL}\n
    Otherwise decline here: ${config.DASHBOARD_URL}/invitation/decline?invitationId=${invitationTokenId}
    `;

    const payload = {
      to: email,
      subject: `You've been invited to join ${orgName}`,
      content: html,
    };

    yield* _(addEmailJob('invitation-email', payload));
  }).pipe(
    Effect.catchAll((error) =>
      pipe(
        Effect.log(
          `Mailer(invitation-email): Failed to send email to ${email}`
        ),
        Effect.flatMap(() => Effect.log(error)),
        // suppress error
        Effect.flatMap(() => Effect.unit)
      )
    )
  );
}
