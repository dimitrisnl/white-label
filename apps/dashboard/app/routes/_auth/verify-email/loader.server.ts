import type {Request} from '@remix-run/node';
import {json} from '@remix-run/node';

import {verifyEmail} from './requests';

export async function loader({request}: {request: Request}) {
  const token = new URL(request.url).searchParams.get('token');
  if (!token) {
    return json({
      ok: false,
      messageObject: {
        message: 'Token was not provided',
      },
    });
  }

  return verifyEmail(token)
    .then(() => {
      return json({ok: true});
    })
    .catch((error) => {
      return json({ok: false, messageObject: error.response.data});
    });
}
