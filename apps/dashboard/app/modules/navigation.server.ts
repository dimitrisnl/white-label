import type {Membership} from './domain/index.server.ts';
import {Redirect} from './responses.server.ts';

export function decideNextTeamRedirect(
  memberships: Array<Membership.Membership>,
  request: Request
) {
  if (memberships.length === 0) {
    return new Redirect({
      to: `/onboarding`,
      init: request,
    });
  }

  return new Redirect({
    to: `/teams/${memberships[0].org.slug}`,
    init: request,
  });
}
