import {PencilSquareIcon} from '@heroicons/react/24/outline';

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
import type {Announcement} from '~/core/domain/announcement.server';

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
                <TableHead className="w-[500px]">Content</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Published By</TableHead>
                <TableHead className="text-right"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {announcements.map((announcement) => (
                <TableRow key={announcement.id}>
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
                  <TableCell className="text-right">
                    <Button size="icon" variant="outline">
                      <PencilSquareIcon className="h-4 w-4" />
                    </Button>
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
