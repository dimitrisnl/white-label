import type {Request} from '@remix-run/node';
import {json} from '@remix-run/node';

import {isErrorObject} from '@/lib/isErrorObject';
import {respond} from '@/lib/respond';

import {verifyEmail} from './requests';

export async function loader({request}: {request: Request}) {
  const token = new URL(request.url).searchParams.get('token');

  if (!token) {
    return respond.fail.validation({
      message: 'Token was not provided',
    });
  }

  return verifyEmail(token)
    .then(() => {
      return json({ok: true});
    })
    .catch((error: unknown) => {
      if (isErrorObject(error)) {
        return respond.fail.validation(error.response.data);
      } else {
        return respond.fail.unknown();
      }
    });
}

export type VerifyEmailLoader = typeof loader;
