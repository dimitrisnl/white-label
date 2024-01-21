import {Badge} from '~/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import type {Membership} from '~/core/domain/membership.server';

export function TeamList({memberships}: {memberships: Array<Membership>}) {
  return (
    <div className="space-y-6">
      <div className="">
        <div className="col-span-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="w-[100px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memberships.map((membership) => (
                <TableRow key={membership.user.id}>
                  <TableCell className="font-medium">
                    {membership.user.name}
                  </TableCell>
                  <TableCell>{membership.user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        membership.role === 'ADMIN' ? 'secondary' : 'outline'
                      }
                    >
                      {membership.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">-</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
