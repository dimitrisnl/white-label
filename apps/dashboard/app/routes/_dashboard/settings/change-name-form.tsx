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

import type {NameChangeAction} from './action.server';

export function ChangeNameForm({initialName}: {initialName: string}) {
  const {Form, state, data} = useFetcher<NameChangeAction>();
  const {toast} = useToast();

  React.useEffect(() => {
    if (data?.ok === true) {
      toast({
        title: 'Name changed',
        description: 'Your name has been changed successfully',
        variant: 'success',
      });
    }
  }, [toast, data]);

  return (
    <Form action="/settings" method="patch">
      <Card>
        <CardHeader>
          <CardTitle>Personal Details</CardTitle>
          <CardDescription>Change your display name</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="team-name">Full Name</Label>
              <Input
                defaultValue={initialName}
                id="full-name"
                name="name"
                placeholder=""
                type="text"
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
            value="CHANGE_NAME_FORM"
            disabled={state !== 'idle'}
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
