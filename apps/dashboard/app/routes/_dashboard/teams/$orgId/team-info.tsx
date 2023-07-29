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

export function TeamInfo({initialName}: {initialName: string}) {
  const {Form, state, data} = useFetcher<NameChangeAction>();
  const {toast} = useToast();

  React.useEffect(() => {
    if (data?.ok === true) {
      toast({
        title: 'Team name changed',
        description: "Your team's name has been changed successfully",
        variant: 'success',
      });
    }
  }, [toast, data]);

  return (
    <Form method="post">
      <Card>
        <CardHeader>
          <CardTitle>Team Name</CardTitle>
          <CardDescription>
            The team's name and owner information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Team Name</Label>
              <Input
                id="name"
                name="name"
                placeholder=""
                type="text"
                defaultValue={initialName}
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
            value="EDIT_ORG_FORM"
            disabled={state !== 'idle'}
          >
            Save
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
