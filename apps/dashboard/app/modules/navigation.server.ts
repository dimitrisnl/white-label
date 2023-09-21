import {Membership} from './domain/index.server';
import {Redirect} from './responses.server';

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

  return new Redirect({
    to: `/teams/${memberships[0].org.slug}`,
    init: request,
  });
}