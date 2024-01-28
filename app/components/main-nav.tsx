import {
  ChevronRightIcon,
  CogIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  HomeIcon,
  LifebuoyIcon,
  PlusCircleIcon,
  PowerIcon,
  PresentationChartBarIcon,
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
          'group flex items-center gap-x-3 rounded-md p-2 text-sm font-semibold',
          {
            'active bg-gray-200 text-gray-900': isActive,
            'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow':
              !isActive,
          }
        )
      }
    >
      <item.icon
        className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-gray-600 group-[.active]:text-gray-800"
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
      name: 'Feature A',
      href: `/teams/${slug}/feature-a`,
      icon: GlobeAltIcon,
      end: false,
    },
    {
      name: 'Feature B',
      href: `/teams/${slug}/feature-b`,
      icon: PresentationChartBarIcon,
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
          <hr className="my-4 border-gray-200" />
          <div className="space-y-2">
            {!user.emailVerified ? <VerifyEmailBanner /> : null}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between px-4"
                  size="lg"
                >
                  <div className="truncate">{user.name}</div>
                  <ChevronRightIcon className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/teams/${slug}/account`}
                      className="group flex cursor-pointer items-center gap-x-3 rounded-md p-2 text-sm text-gray-600"
                    >
                      <UserCircleIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600" />
                      Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/teams/${slug}/account/invitations`}
                      className="group flex cursor-pointer items-center gap-x-3 rounded-md p-2 text-sm text-gray-600"
                    >
                      <EnvelopeIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600" />
                      Invitations
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem asChild>
                    <Link
                      to={`/teams/create-new-team`}
                      className="group flex cursor-pointer items-center gap-x-3 rounded-md p-2 text-sm text-gray-600"
                    >
                      <PlusCircleIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600" />
                      Create new team
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled asChild>
                  <div className="group flex cursor-pointer items-center gap-x-3 rounded-md p-2 text-sm text-gray-600">
                    <LifebuoyIcon className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-gray-600" />
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
