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
import {useTypedFetcher} from 'remix-typedjson';

import {ErrorMessage} from '@/components/error-feedback.tsx';

import type {Action} from './_action.server.ts';

export function TeamInfo() {
  const {Form, state, data} = useTypedFetcher<Action | undefined>();

  return (
    <Form method="post">
      <Card className="min-w-[400px] border-t-4 border-t-blue-700">
        <CardHeader>
          <CardTitle>Create your team</CardTitle>
          <CardDescription>
            You will be the Owner of this team. You can invite others for
            collaboration on a later step
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
                minLength={2}
                required
                disabled={state !== 'idle'}
              />
            </div>
            {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link to="/onboarding" className={buttonVariants({variant: 'ghost'})}>
            Back
          </Link>
          <Button disabled={state !== 'idle'}>Save</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
