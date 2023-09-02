import type {Request} from '@remix-run/node';
import {pipe} from 'fp-ts/lib/function';

import {createUserSession} from '@/modules/session.server';
import {createUser} from '@/modules/use-cases/index.server';
import {E} from '@/utils/fp';
import {respond} from '@/utils/respond.server';

export async function action({request}: {request: Request}) {
  const formData = await request.formData();
  const {validate, execute} = createUser();
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
      ({user}) =>
        createUserSession({
          request,
          userId: user.id,
          remember: true,
        })
    )
  );
}

export type RegisterRequestAction = typeof action;
