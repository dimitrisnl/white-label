import {
  ChevronRightIcon,
  CogIcon,
  EnvelopeIcon,
  HomeIcon,
  LifebuoyIcon,
  MegaphoneIcon,
  PlusCircleIcon,
  PowerIcon,
} from '@heroicons/react/24/outline';
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon';
import {Link, NavLink, useParams} from '@remix-run/react';

import type {User} from '~/core/domain/user.server';
import {cn} from '~/utils/classname-utils';

import {Button} from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {VerifyEmailBanner} from './verify-email-banner';

function StyledLink({
  item,
}: {
  item: {
    end: boolean;
    href: string;
    icon: React.ElementType;
    name: string;
  };
}) {
  return (
    <NavLink
      end={item.end}
      to={item.href}
      className={({isActive}) =>
        cn(
          'group flex items-center gap-x-3 rounded-md p-2 text-sm font-medium',
          {
            'active bg-gray-200 text-gray-900 dark:bg-gray-900 dark:text-white':
              isActive,
            'text-gray-600 hover:bg-white hover:text-gray-800 hover:shadow dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-300':
              !isActive,
          }
        )
      }
    >
      <item.icon
        className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-gray-600 group-[.active]:text-gray-800 dark:group-hover:text-gray-300 dark:group-[.active]:text-gray-300"
        aria-hidden="true"
      />
      {item.name}
    </NavLink>
  );
}

export function MainNav({user}: {user: User}) {
  const {slug} = useParams();

  const topMenu = [
    {name: 'Dashboard', href: '', icon: HomeIcon, end: true},
    {
      name: 'Announcements',
      href: `/teams/${slug}/announcements`,
      icon: MegaphoneIcon,
      end: false,
    },
    {
      name: 'Team Settings',
      href: `/teams/${slug}/settings`,
      icon: CogIcon,
      end: false,
    },
  ];

  return (
    <nav className="flex flex-1 flex-col">
      <ul className="flex flex-1 flex-col gap-y-7">
        <li>
          <ul className="space-y-1">
            {topMenu.map((item) => (
              <li key={item.name}>
                <StyledLink item={item} />
              </li>
            ))}
          </ul>
        </li>
        <li className="mt-auto">
          <hr className="my-4 border-gray-200 dark:border-white/5" />
          <div className="space-y-2">
            {!user.emailVerified ? <VerifyEmailBanner /> : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between px-4 text-gray-700 dark:text-gray-200"
                  size="lg"
                >
                  <div className="flex min-w-0 items-center space-x-2">
                    <div className="h-2 w-2 rounded-full bg-green-600 dark:bg-green-300"></div>
                    <div className="truncate">{user.name}</div>
                  </div>
                  <ChevronRightIcon className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/teams/${slug}/account`}
                      className="group flex cursor-pointer items-center gap-x-3 rounded-md p-2 text-sm text-gray-600 dark:text-gray-100"
                    >
                      <UserCircleIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-100" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/teams/${slug}/account/invitations`}
                      className="group flex cursor-pointer items-center gap-x-3 rounded-md p-2 text-sm text-gray-600 dark:text-gray-100"
                    >
                      <EnvelopeIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-100" />
                      Invitations
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/teams/create-new-team`}
                      className="group flex cursor-pointer items-center gap-x-3 rounded-md p-2 text-sm text-gray-600 dark:text-gray-100"
                    >
                      <PlusCircleIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-100" />
                      Create new team
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled asChild>
                  <div className="group flex cursor-pointer items-center gap-x-3 rounded-md p-2 text-sm text-gray-600 dark:text-gray-100">
                    <LifebuoyIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-100" />
                    Support
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to="/logout"
                    className="group flex cursor-pointer items-center gap-x-3 rounded-md p-2 text-sm text-red-600 hover:!text-red-600"
                  >
                    <PowerIcon
                      className="h-5 w-5 shrink-0 text-red-400 group-hover:text-red-600"
                      aria-hidden="true"
                    />
                    Logout
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </li>
      </ul>
    </nav>
  );
}
