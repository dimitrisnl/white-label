import {InvitationEmailTemplate} from '@white-label/email-templates';
import * as Effect from 'effect/Effect';
import {pipe} from 'effect/Function';

import {buildTemplate} from '../build-template.server';
import {config} from '../config.server';
import {sendEmail} from '../send-email.server';

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
    yield* _(
      Effect.log(
        `Mailer(invitation-email): Sending invitation email to ${email}`
      )
    );
    // eslint-disable-next-line
    const html = yield* _(
      buildTemplate(
        <InvitationEmailTemplate
          orgName={orgName}
          dashboardUrl={config.DASHBOARD_URL}
          invitationDeclineUrl={`${config.DASHBOARD_URL}/invitation/decline?invitationId=${invitationTokenId}`}
        />
      )
    );

    yield* _(
      sendEmail({
        to: email,
        subject: `You've been invited to join ${orgName}`,
        content: html,
      })
    );
    yield* _(
      Effect.log(`Mailer(invitation-email): Sent invitation email to ${email}`)
    );
  }).pipe(
    Effect.catchAll((error) =>
      pipe(
        Effect.log(
          `Mailer(invitation-email): Failed to send invitation email to ${email}`
        ),
        Effect.flatMap(() => Effect.log(error)),
        // suppress error
        Effect.flatMap(() => Effect.unit)
      )
    )
  );
}
