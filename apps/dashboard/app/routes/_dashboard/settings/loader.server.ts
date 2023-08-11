import type {Request} from '@remix-run/node';

import {requireUser} from '@/modules/session.server';
import {respond} from '@/utils/respond.server';

export async function loader({request}: {request: Request}) {
  const userData = await requireUser(request);
  return respond.ok.data(userData);
}

export type SettingsLoaderData = typeof loader;
