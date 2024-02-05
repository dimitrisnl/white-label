import {useTypedFetcher} from 'remix-typedjson';

import {ErrorMessage} from '~/components/error-feedback.tsx';
import {Badge} from '~/components/ui/badge';
import {Button} from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import type {MembershipInvitation} from '~/core/domain/membership-invitation.server.ts';

import type {AcceptInvitationAction} from './_action.server.ts';

export function JoinTeamForm({invitation}: {invitation: MembershipInvitation}) {
  const {Form, state, data} = useTypedFetcher<
    AcceptInvitationAction | undefined
  >();

  return (
    <Form method="post">
      <Card>
        <CardHeader>
          <CardTitle>
            You've been invited to join <strong>{invitation.org.name}</strong>
          </CardTitle>
          <CardDescription>
            When you accept the invitation, you will be immediately redirected
            to the team's dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm">
          You've been invited to {invitation.org.name} as a{' '}
          <Badge variant="outline">{invitation.role}</Badge>
          {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="destructive" size="sm">
            Decline
          </Button>
          <Button
            disabled={state !== 'idle'}
            variant="default"
            value={invitation.id}
            name="invitationId"
            size="sm"
          >
            Join {invitation.org.name}
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
