import {useFetcher} from '@remix-run/react';
import React from 'react';
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
  useToast,
} from 'ui-core';

import {
  UnknownErrorMessage,
  ValidationErrorMessage,
} from '@/components/error-feedback';

import type {PasswordChangeAction} from './action.server';

export function ChangePasswordForm() {
  const {Form, data, state} = useFetcher<PasswordChangeAction>();
  const {toast} = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  React.useEffect(() => {
    if (data?.ok === true) {
      formRef.current?.reset();
      toast({
        title: 'Password changed',
        description: 'Your password has been changed successfully',
        variant: 'success',
      });
    }
  }, [toast, data]);

  return (
    <Form action="/settings" method="patch" ref={formRef}>
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>Change your password</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="team-name">Current Password</Label>
              <Input
                id="old-password"
                name="oldPassword"
                placeholder=""
                type="password"
                disabled={state !== 'idle'}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="team-name">New Password</Label>
              <Input
                id="new-password"
                name="newPassword"
                placeholder=""
                type="password"
                disabled={state !== 'idle'}
              />
            </div>
            {data?.ok === false && data.type === 'validation' ? (
              <ValidationErrorMessage errors={data.messageObj} />
            ) : null}
            {data?.ok === false && data.type === 'unknown' ? (
              <UnknownErrorMessage />
            ) : null}
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
