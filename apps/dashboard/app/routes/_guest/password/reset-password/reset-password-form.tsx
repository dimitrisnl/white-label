import {Link} from '@remix-run/react';
import {Button, buttonVariants} from '@white-label/ui-core/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core/card';
import {Input} from '@white-label/ui-core/input';
import {Label} from '@white-label/ui-core/label';
import {PasswordInput} from '@white-label/ui-core/password-input';
import {useTypedFetcher} from 'remix-typedjson';

import {ErrorMessage} from '~/components/error-feedback.tsx';

import type {ResetPasswordAction} from './_action.server.ts';

export function ResetPasswordForm({token}: {token: string}) {
  const {Form, state, data} = useTypedFetcher<
    ResetPasswordAction | undefined
  >();

  return (
    <Form method="post">
      <Card className="w-[480px]">
        <CardHeader className="text-center">
          <CardTitle>Create a new password</CardTitle>
          <CardDescription>
            Ensure you're using a mix of characters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">New Password</Label>
              <PasswordInput
                id="password"
                name="password"
                disabled={state !== 'idle'}
                required
                minLength={8}
              />
            </div>

            <Input
              className="hidden"
              id="token"
              name="token"
              type="text"
              defaultValue={token}
              disabled={state !== 'idle'}
            />
            <Button>Set new Password</Button>

            {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
          </div>
        </CardContent>
        <CardFooter className="text-center">
          <Link to="/login" className={buttonVariants({variant: 'link'})}>
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </Form>
  );
}
