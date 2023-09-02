import type {Request} from '@remix-run/node';
import {pipe} from 'fp-ts/lib/function';

import {verifyPasswordReset} from '@/modules/use-cases/index.server';
import {E} from '@/utils/fp';
import {respond} from '@/utils/respond.server';

export async function loader({request}: {request: Request}) {
  const token = new URL(request.url).searchParams.get('token');
  if (!token) {
    return respond.fail.unknown();
  }

  const {validate, execute} = verifyPasswordReset();

  const validation = validate({token});

  if (!validation.success) {
    return respond.fail.unknown();
  }

  const payload = validation.data;

  const response = await execute(payload);

  return pipe(
    response,
    E.matchW(
      () => respond.fail.unknown(),
      () => respond.ok.data({token})
    )
  );
}

export type ResetPasswordLoader = typeof loader;
