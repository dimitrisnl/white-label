import type {Request} from '@remix-run/node';
import {pipe} from 'fp-ts/lib/function';

import {verifyEmailToken} from '@/modules/use-cases/index.server';
import {E} from '@/utils/fp';
import {respond} from '@/utils/respond.server';

export async function loader({request}: {request: Request}) {
  const token = new URL(request.url).searchParams.get('token');

  if (!token) {
    return respond.fail.validation({
      message: 'Token was not provided',
    });
  }

  const {validate, execute} = verifyEmailToken();

  const validation = validate({token});

  if (!validation.success) {
    return respond.fail.validation({
      message: 'Token was in incorrect format',
    });
  }

  const response = await execute({token});

  return pipe(
    response,
    E.matchW(
      () => respond.fail.unknown(),
      () => respond.ok.empty()
    )
  );
}

export type VerifyEmailLoader = typeof loader;
