import type {Request} from '@remix-run/node';
import {requestPasswordResetRequest} from 'api-contract';

import {isErrorObject} from '@/lib/isErrorObject';
import {respond} from '@/lib/respond';

import {forgotPassword} from './requests';

export async function action({request}: {request: Request}) {
  const formData = await request.formData();
  const validation = requestPasswordResetRequest.validate(formData);

  // todo: fix
  if (!validation.success) {
    return respond.fail.validation({
      email: 'Invalid email address',
    });
  }

  const payload = validation.data;

  return forgotPassword(payload)
    .then(() => respond.ok.empty())
    .catch((error) => {
      if (isErrorObject(error)) {
        return respond.fail.validation(error.response.data);
      } else {
        return respond.fail.unknown();
      }
    });
}

export type ForgotPasswordAction = typeof action;
