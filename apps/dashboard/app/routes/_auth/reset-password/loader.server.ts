import type {Request} from '@remix-run/node';

import {respond} from '@/lib/respond';

import {verifyResetPasswordToken} from './requests';

export async function loader({request}: {request: Request}) {
  const token = new URL(request.url).searchParams.get('token');
  if (!token) {
    return respond.fail.unknown();
  }

  return verifyResetPasswordToken({token})
    .then(() => {
      return respond.ok.data({token});
    })
    .catch(() => {
      return respond.fail.unknown();
    });
}

export type ResetPasswordLoader = typeof loader;
