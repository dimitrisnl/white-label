import type {Request} from '@remix-run/node';

import {createUserSession} from '@/modules/session.server';
import {verifyUserCredentials} from '@/modules/use-cases/index.server';
import {E, pipe} from '@/utils/fp';
import {respond} from '@/utils/respond.server';

export async function action({request}: {request: Request}) {
  const formData = await request.formData();
  const {validate, execute} = verifyUserCredentials();

  const validation = validate(Object.fromEntries(formData));

  // todo: fix
  if (!validation.success) {
    return respond.fail.validation({
      email: 'Invalid credentials',
    });
  }

  const response = await execute(validation.data);

  return pipe(
    response,
    E.matchW(
      () => respond.fail.unknown(),
      (user) =>
        createUserSession({
          request,
          userId: user.id,
          remember: true,
          redirectTo: '/',
        })
    )
  );
}

export type LoginRequestAction = typeof action;
