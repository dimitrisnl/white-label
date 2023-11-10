import {Button} from '@white-label/ui-core/button';
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
      <Card className="w-[480px] border-t-4 border-t-blue-700">
        <CardHeader>
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

            {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Set new Password</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
