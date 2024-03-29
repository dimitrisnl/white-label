import {Link} from '@remix-run/react';
import {useTypedFetcher} from 'remix-typedjson';

import {ErrorMessage} from '~/components/error-feedback.tsx';
import {Button, buttonVariants} from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {Input} from '~/components/ui/input';
import {Label} from '~/components/ui/label';
import {PasswordInput} from '~/components/ui/password-input';

import type {ResetPasswordAction} from './_action.server.ts';

export function ResetPasswordForm({token}: {token: string}) {
  const {Form, state, data} = useTypedFetcher<
    ResetPasswordAction | undefined
  >();

  return (
    <Form method="post">
      <Card className="w-[420px]">
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
