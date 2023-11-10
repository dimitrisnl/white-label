import {Button} from '@white-label/ui-core/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core/card';
import {Label} from '@white-label/ui-core/label';
import {PasswordInput} from '@white-label/ui-core/password-input';
import {toast} from '@white-label/ui-core/toast';
import React from 'react';
import {useTypedFetcher} from 'remix-typedjson';

import {ErrorMessage} from '~/components/error-feedback.tsx';

import type {ChangePasswordAction} from './_action.server.ts';

export function ChangePasswordForm() {
  const {Form, data, state} = useTypedFetcher<
    ChangePasswordAction | undefined
  >();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (data?.ok === true) {
      formRef.current?.reset();
      toast.success('Password changed');
    }
  }, [data]);

  return (
    <Form method="patch" ref={formRef}>
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="team-name">Current Password</Label>
              <PasswordInput
                id="old-password"
                name="oldPassword"
                placeholder=""
                disabled={state !== 'idle'}
                minLength={8}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="team-name">New Password</Label>
              <PasswordInput
                id="new-password"
                name="newPassword"
                placeholder=""
                disabled={state !== 'idle'}
                minLength={8}
                required
              />
            </div>
            {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            name="formName"
            value="CHANGE_PASSWORD_FORM"
            disabled={state !== 'idle'}
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
