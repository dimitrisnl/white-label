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
} from '@white-label/ui-core';
import {useEffect, useRef} from 'react';
import {useTypedFetcher} from 'remix-typedjson';

import type {CreateMembershipInvitationAction} from './action.server';

export function TeamInvitations() {
  const {Form, state, data} = useTypedFetcher<
    CreateMembershipInvitationAction | undefined
  >();
  const {toast} = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (data?.ok === true) {
      formRef.current?.reset();
      toast({
        title: 'Invited!',
        description: 'You have invited a new team member successfully',
        variant: 'success',
      });
    } else if (data?.ok === false) {
      toast({
        title: 'An error occured',
        description: 'Could not invite your teammate at this time',
        variant: 'destructive',
      });
    }
  }, [toast, data]);

  return (
    <Form method="post" ref={formRef}>
      <Card>
        <CardHeader>
          <CardTitle>Add a team member</CardTitle>
          <CardDescription>
            Provide the email address of the person you would like to invite to
            this team.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="flex flex-1 flex-col space-y-1.5">
              <Label htmlFor="new-member-email">Email</Label>
              <Input
                id="new-member-email"
                name="email"
                placeholder=""
                type="email"
                disabled={state !== 'idle'}
              />
            </div>
            <select
              disabled={state !== 'idle'}
              name="role"
              defaultValue="MEMBER"
            >
              <option value="ADMIN">Admin</option>
              <option value="MEMBER">Member</option>
            </select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button
            name="formName"
            value="CREATE_MEMBERSHIP_INVITATION_FORM"
            disabled={state !== 'idle'}
          >
            Invite
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
