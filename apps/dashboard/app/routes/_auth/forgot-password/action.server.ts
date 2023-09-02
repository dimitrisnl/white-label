import type {Request} from '@remix-run/node';

import {requestPasswordReset} from '@/modules/use-cases/index.server';
import {E, pipe} from '@/utils/fp';
import {respond} from '@/utils/respond.server';

export async function action({request}: {request: Request}) {
  const formData = await request.formData();

  const {validate, execute} = requestPasswordReset();
  const validation = validate(Object.fromEntries(formData));

  // todo: fix
  if (!validation.success) {
    return respond.fail.validation({
      email: 'Invalid email address',
    });
  }

  const payload = validation.data;

  const response = await execute(payload);

  return pipe(
    response,
    E.matchW(
      () => respond.fail.unknown(),
      () => respond.ok.empty()
    )
  );
}

export type ForgotPasswordAction = typeof action;
