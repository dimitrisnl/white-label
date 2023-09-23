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
  toast,
} from '@white-label/ui-core';
import React from 'react';
import {useTypedFetcher} from 'remix-typedjson';

import {ErrorMessage} from '@/components/error-feedback';

import type {Action} from './_action.server';

export function TeamInfo({initialName}: {initialName: string}) {
  const {Form, state, data} = useTypedFetcher<Action | undefined>();

  React.useEffect(() => {
    if (data?.ok === true) {
      toast.success('Team name changed');
    }
  }, [data]);

  return (
    <Form method="patch">
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
                minLength={2}
                required
              />
            </div>
            {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
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
