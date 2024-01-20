import {ArrowUturnLeftIcon, TrashIcon} from '@heroicons/react/24/outline';
import {Badge} from '@white-label/ui-core/badge';
import {Button} from '@white-label/ui-core/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@white-label/ui-core/table';
import {toast} from '@white-label/ui-core/toast';
import {useEffect} from 'react';
import {useTypedFetcher} from 'remix-typedjson';

import type {MembershipInvitation} from '~/modules/domain/index.server.ts';

import type {Action} from './_action.server.ts';

export function InvitationsList({
  invitations,
}: {
  invitations: Array<MembershipInvitation.MembershipInvitation>;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-12">
        <div>
          <h2 className="text-lg font-medium leading-10 text-gray-700">
            Invitations
          </h2>
          <p className="w-80 text-sm text-gray-500">
            Delete or revoke your sent invitations
          </p>
        </div>
        <div className="col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
                <TableHead className="w-[100px]">Invited as</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell className="font-medium">
                    {invitation.email}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        invitation.status === 'PENDING'
                          ? 'outline'
                          : 'destructive'
                      }
                    >
                      {invitation.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{invitation.role}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <InvitationActions invitation={invitation} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

function InvitationActions({
  invitation,
}: {
  invitation: MembershipInvitation.MembershipInvitation;
}) {
  const {Form, state, data} = useTypedFetcher<Action | undefined>();

  useEffect(() => {
    if (data?.ok === true) {
      toast.success('Invitation deleted');
    } else if (data?.ok === false) {
      const message = data.errors[0] ?? 'Huh';
      toast.error(message);
    }
  }, [data]);

  return (
    <Form className="flex items-center" method="DELETE">
      <input type="hidden" name="invitationId" value={invitation.id} />
      <div className="ml-auto flex items-center space-x-2">
        {invitation.status === 'DECLINED' ? (
          <Button
            variant="destructive"
            size="sm"
            name="intent"
            value="delete"
            disabled={state !== 'idle'}
          >
            <TrashIcon className="mr-2 h-4 w-4" /> Delete
          </Button>
        ) : null}
        {invitation.status === 'PENDING' ? (
          <>
            <Button
              variant="destructive"
              size="sm"
              name="intent"
              value="delete"
              disabled={state !== 'idle'}
            >
              <ArrowUturnLeftIcon className="mr-2 h-4 w-4" />
              Revoke
            </Button>
          </>
        ) : null}
      </div>
    </Form>
  );
}
