import {useFetcher} from '@remix-run/react';
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
} from 'ui-core';

import {ErrorFeedback} from '@/components/error-feedback';

export function TeamInfo({initialName}: {initialName: string}) {
  const {Form, state, data} = useFetcher();

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
            {data?.ok === false ? (
              <ErrorFeedback errors={data.messageObject} />
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          {data?.ok === true ? (
            <div className="mr-8 text-sm font-medium text-green-700">
              Saved!
            </div>
          ) : null}
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
