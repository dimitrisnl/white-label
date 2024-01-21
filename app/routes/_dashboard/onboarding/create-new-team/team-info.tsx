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

import type {CreateNewTeamAction} from './_action.server.ts';

export function TeamInfo() {
  const {Form, state, data} = useTypedFetcher<
    CreateNewTeamAction | undefined
  >();

  return (
    <Form method="post">
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Create your team</CardTitle>
          <CardDescription>
            <div>
              You will be the <strong>Owner</strong> of this team.
            </div>
            <div>You can invite others for collaboration on a later step</div>
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
            <Button className="w-full" disabled={state !== 'idle'}>
              Create team
            </Button>

            {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
          </div>
        </CardContent>
        <CardFooter className="text-center">
          <Link to="/onboarding" className={buttonVariants({variant: 'ghost'})}>
            Go back
          </Link>
        </CardFooter>
      </Card>
    </Form>
  );
}
