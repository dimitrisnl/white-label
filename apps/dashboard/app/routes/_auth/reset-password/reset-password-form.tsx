import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@white-label/ui-core';
import {useTypedFetcher} from 'remix-typedjson';

import {
  UnknownErrorMessage,
  ValidationErrorMessage,
} from '@/components/error-feedback';

import type {ResetPasswordAction} from './action.server';

export function ResetPasswordForm({token}: {token: string}) {
  const {Form, state, data} = useTypedFetcher<
    ResetPasswordAction | undefined
  >();

  // todo: ensure both passwords match
  return (
    <Form action="/reset-password" method="post">
      <Card className="w-[480px] border-t-4 border-t-blue-700 p-2">
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
              <Input
                id="password"
                name="password"
                type="password"
                disabled={state !== 'idle'}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                disabled={state !== 'idle'}
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

            {data?.type === 'validation' ? (
              <ValidationErrorMessage errors={data.messageObj} />
            ) : null}
            {data?.type === 'unknown' ? <UnknownErrorMessage /> : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Set new Password</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
