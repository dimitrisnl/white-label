import type {Request} from '@remix-run/node';

import {requireToken} from '@/lib/session';

export function loader({request}: {request: Request}) {
  return requireToken(request);
}
