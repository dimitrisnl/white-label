import {PlusCircleIcon, UserIcon, UsersIcon} from '@heroicons/react/24/outline';
import {
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import {Link} from '@remix-run/react';
import {Button} from '@white-label/ui-core/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@white-label/ui-core/dropdown-menu';

export function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <UserCircleIcon className="h-6 w-6 fill-blue-400" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem>
          <Link to="/account" className="flex w-full items-center">
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Account</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link to="/teams" className="flex w-full items-center">
            <UsersIcon className="mr-2 h-4 w-4" />
            <span>Teams</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            to="/teams/create-new-team"
            className="flex w-full items-center"
          >
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            <span>New Team</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Link
            to="/logout"
            className="flex w-full items-center text-red-600 hover:text-red-500 "
          >
            <ArrowRightOnRectangleIcon className="mr-2 h-4 w-4" />
            <span>Logout</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
