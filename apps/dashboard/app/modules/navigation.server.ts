import type {Membership} from './domain/index.server.ts';
import {Redirect} from './responses.server.ts';

// Todo: This should be extended and look for the previous used team
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

  // this is wrong, but ts.config noUncheckedIndexedAccess is annoying me right now
  if (!memberships[0]?.org) {
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
