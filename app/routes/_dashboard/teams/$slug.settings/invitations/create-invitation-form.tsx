import {useEffect, useRef} from 'react';
import {useTypedFetcher} from 'remix-typedjson';

import {Button} from '~/components/ui/button';
import {Input} from '~/components/ui/input';
import {Label} from '~/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import {toast} from '~/components/ui/toast';

import type {Action} from './_action.server.ts';

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
    <div className="grid grid-cols-3 gap-12">
      <div>
        <h2 className="text-lg font-medium leading-10 text-gray-700 dark:text-gray-100">
          Add a team member
        </h2>
        <p className="w-80 text-sm text-gray-500 dark:text-gray-300">
          Provide the email address of the person you would like to invite to
          this team.
        </p>
      </div>
      <div className="col-span-2">
        <Form method="post" ref={formRef}>
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
            <div className="mt-auto">
              <Button name="intent" disabled={state !== 'idle'} value="create">
                Invite
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
}
