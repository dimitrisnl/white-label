import {PencilSquareIcon, TrashIcon} from '@heroicons/react/24/outline';
import {Link} from '@remix-run/react';
import React from 'react';
import {useTypedFetcher} from 'remix-typedjson';
import {toast} from 'sonner';

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
import {Button, buttonVariants} from '~/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import type {Announcement} from '~/core/domain/announcement.server';

import type {Action} from './_action.server';

function DeleteConfirmationDialog({
  announcement,
}: {
  announcement: Announcement;
}) {
  const {Form, state, data} = useTypedFetcher<Action | undefined>();

  React.useEffect(() => {
    if (data?.ok === true) {
      toast.success('Announcement deleted');
    } else if (data?.ok === false) {
      const message = data.errors[0] ?? 'Something went wrong';
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
          <input type="hidden" name="announcementId" value={announcement.id} />
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this announcement?</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription>
            Are you sure you want to delete this announcement? This action
            cannot be undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              name="intent"
              value="delete"
              disabled={state !== 'idle'}
            >
              Delete this announcement
            </AlertDialogAction>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function AnnouncementsTable({
  announcements,
}: {
  announcements: Array<Announcement>;
}) {
  return (
    <div className="space-y-6">
      <div className="">
        <div className="col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Title</TableHead>
                <TableHead className="w-[300px]">Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Published By</TableHead>
                <TableHead className="w-[180px] text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement) => (
                <TableRow key={announcement.id} className="hover:bg-none!">
                  <TableCell className="font-medium">
                    {announcement.title}
                  </TableCell>
                  <TableCell>
                    {announcement.content.length > 200 ? (
                      <div>
                        {announcement.content.slice(0, 180)}
                        <span className="ml-1 text-gray-400">(...)</span>
                      </div>
                    ) : (
                      announcement.content
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge>{announcement.status}</Badge>
                  </TableCell>
                  <TableCell>{announcement.createdByUser?.name}</TableCell>
                  <TableCell>
                    {announcement.publishedByUser?.name ?? '-'}
                  </TableCell>
                  <TableCell className="flex items-center space-x-2 text-right">
                    <DeleteConfirmationDialog announcement={announcement} />

                    <Link
                      to={announcement.id}
                      className={buttonVariants({
                        variant: 'outline',
                        size: 'sm',
                      })}
                    >
                      <PencilSquareIcon className="mr-2 h-4 w-4" /> Edit
                    </Link>
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
