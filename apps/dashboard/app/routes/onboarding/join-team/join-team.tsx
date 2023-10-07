import {Link} from '@remix-run/react';
import {
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core';
import {useTypedFetcher, useTypedLoaderData} from 'remix-typedjson';

import {ErrorMessage} from '@/components/error-feedback';

import {Action} from './_action.server';
import {UserInvitationsLoaderData} from './_loader.server';
import {NoInvitations} from './no-invitations';

export function JoinMyTeam() {
  const {
    data: {invitations},
  } = useTypedLoaderData<UserInvitationsLoaderData>();

  const {Form, state, data} = useTypedFetcher<Action | undefined>();

  if (invitations.length === 0) {
    return (
      <div className="flex max-w-[1000px] justify-center">
        <NoInvitations />
      </div>
    );
  }

  // todo: decide what to do for multiple ones (far-fetched)
  const invitation = invitations[0];
  return (
    <div className="space-y-8">
      <Form method="post">
        <Card className="min-w-[400px]">
          <CardHeader>
            <CardTitle>
              You've been invited to join <strong>{invitation.org.name}</strong>
            </CardTitle>
            <CardDescription>
              When you accept the invitation, you will be immediately redirected
              to the team's dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            You've been invited to {invitation.org.name}. Your role within the
            team will be {invitation.role}
            {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Link
              to="/onboarding"
              className={buttonVariants({variant: 'ghost'})}
            >
              Back
            </Link>
            <Button
              disabled={state !== 'idle'}
              variant="default"
              value={invitation.id}
              name="invitationId"
            >
              Join team
            </Button>
          </CardFooter>
        </Card>
      </Form>
    </div>
  );
}
