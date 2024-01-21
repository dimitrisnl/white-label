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
import {cn} from '~/utils/classname-utils.ts';

import type {CreateNewTeamAction} from './_action.server.ts';

export function TeamInfo() {
  const {Form, state, data} = useTypedFetcher<
    CreateNewTeamAction | undefined
  >();

  return (
    <Form method="post">
      <Card className="min-w-[400px]">
        <CardHeader className="text-center">
          <CardTitle>Create your team</CardTitle>
          <CardDescription>You will be the owner of this team</CardDescription>
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
            <Button disabled={state !== 'idle'}>Create new team</Button>
            {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            to="/"
            reloadDocument
            className={cn(buttonVariants({variant: 'link'}), 'text-xs')}
          >
            Go back
          </Link>
        </CardFooter>
      </Card>
    </Form>
  );
}
