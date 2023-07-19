import type {Request} from '@remix-run/node';

import {logout} from '@/lib/session';

export async function action({request}: {request: Request}) {
  return logout(request);
}

export async function loader({request}: {request: Request}) {
  return logout(request);
}
