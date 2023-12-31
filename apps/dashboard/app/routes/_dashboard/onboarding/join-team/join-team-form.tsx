import {Button} from '@white-label/ui-core/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core/card';
import {useTypedFetcher} from 'remix-typedjson';

import {ErrorMessage} from '~/components/error-feedback.tsx';
import type {MembershipInvitation} from '~/modules/domain/index.server.ts';

import type {JoinTeamAction} from './_action.server.ts';

export function JoinTeamForm({
  invitation,
}: {
  invitation: MembershipInvitation.MembershipInvitation;
}) {
  const {Form, state, data} = useTypedFetcher<JoinTeamAction | undefined>();

  return (
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
        <CardFooter className="flex justify-center">
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
  );
}
