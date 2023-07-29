import type {Request} from '@remix-run/node';
import {registerRequest} from 'api-contract';

import {isErrorObject} from '@/lib/isErrorObject';
import {respond} from '@/lib/respond';
import {createUserSession} from '@/lib/session';

import {register} from './requests';

export async function action({request}: {request: Request}) {
  const formData = await request.formData();
  const validation = registerRequest.validate(Object.fromEntries(formData));

  // todo: fix
  if (!validation.success) {
    return respond.fail.validation({
      email: 'Invalid credentials',
    });
  }

  const payload = validation.data;

  return register(payload)
    .then(({data}) => {
      return createUserSession({
        request,
        token: data.token.token,
      });
    })
    .catch((error: unknown) => {
      console.log(error);
      if (isErrorObject(error)) {
        return respond.fail.validation(error.response.data);
      } else {
        return respond.fail.unknown();
      }
    });
}

export type RegisterRequestAction = typeof action;
