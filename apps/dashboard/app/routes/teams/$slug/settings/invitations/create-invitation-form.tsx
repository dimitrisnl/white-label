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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from '@white-label/ui-core';
import {useEffect, useRef} from 'react';
import {useTypedFetcher} from 'remix-typedjson';

import type {Action} from './_action.server';

export function CreateInvitationForm() {
  const {Form, state, data} = useTypedFetcher<Action | undefined>();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (data?.ok === true) {
      formRef.current?.reset();
      toast.success('Invitation sent');
    } else if (data?.ok === false) {
      const message =
        data.errors[0] ?? 'Could not invite your teammate at this time';
      toast.error(message);
    }
  }, [data]);

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
                required
              />
            </div>

            <div className="flex w-[180px] flex-shrink-0 flex-col space-y-1.5">
              <Label>Role</Label>
              <Select
                disabled={state !== 'idle'}
                name="role"
                defaultValue="MEMBER"
              >
                <SelectTrigger>
                  <SelectValue placeholder="MEMBER" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="MEMBER">Member</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button name="intent" disabled={state !== 'idle'} value="create">
            Invite
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
