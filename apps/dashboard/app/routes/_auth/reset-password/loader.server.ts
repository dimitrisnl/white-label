import type {Request} from '@remix-run/node';
import {json} from '@remix-run/node';

import {verifyResetPasswordToken} from './requests';

export async function loader({request}: {request: Request}) {
  const token = new URL(request.url).searchParams.get('token');
  if (!token) {
    return json({ok: false, token: null});
  }

  return verifyResetPasswordToken(token)
    .then((res) => {
      return json({ok: true, token});
    })
    .catch(() => {
      return json({ok: false, token: null});
    });
}
