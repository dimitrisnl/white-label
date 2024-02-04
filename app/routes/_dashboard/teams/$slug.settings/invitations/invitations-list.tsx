import {TrashIcon} from '@heroicons/react/24/solid';
import {useEffect} from 'react';
import {useTypedFetcher} from 'remix-typedjson';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog';
import {Badge} from '~/components/ui/badge';
import {Button} from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import {toast} from '~/components/ui/toast';
import type {MembershipInvitation} from '~/core/domain/membership-invitation.server.ts';

import type {Action} from './_action.server.ts';

function DeleteConfirmationDialog({
  invitation,
}: {
  invitation: MembershipInvitation;
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <TrashIcon className="mr-2 h-4 w-4" /> Delete
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent asChild>
        <Form className="flex items-center" method="DELETE">
          <input type="hidden" name="invitationId" value={invitation.id} />
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this invitation?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              invitation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              name="intent"
              value="delete"
              disabled={state !== 'idle'}
            >
              Delete this invitation
            </AlertDialogAction>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function InvitationsList({
  invitations,
}: {
  invitations: Array<MembershipInvitation>;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-12">
        <div>
          <h2 className="text-lg font-medium leading-10 text-gray-700 dark:text-gray-100">
            Invitations
          </h2>
          <p className="w-80 text-sm text-gray-500 dark:text-gray-300">
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
                    <DeleteConfirmationDialog invitation={invitation} />
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
