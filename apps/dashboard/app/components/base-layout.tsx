import {Link} from '@remix-run/react';
import {Popover, PopoverContent, PopoverTrigger} from '@white-label/ui-core';
import {BellIcon} from 'lucide-react';
import React from 'react';

import {UserNav} from '@/components/user-nav';
import type {Membership, User} from '@/modules/domain/index.server';

import TeamSwitcher from './team-switcher';

function UpdatesPopover() {
  return (
    <Popover>
      <PopoverTrigger>
        <BellIcon className="h-5 w-5" />
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end" forceMount>
        <div className="text-center text-xs text-gray-700">Nothing to show</div>
      </PopoverContent>
    </Popover>
  );
}

export function BaseLayout({
  children,
  title,
  subMenu,
  currentUser,
}: {
  children: React.ReactNode;
  title: string;
  subMenu?: React.ReactNode;
  currentUser: {user: User.User; memberships: Array<Membership.Membership>};
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b shadow-2xl">
        <div className="flex h-16 items-center border-b px-4">
          <Link to="/teams" className="mr-4 text-2xl font-bold tracking-tight">
            White Label
          </Link>
          <TeamSwitcher memberships={currentUser.memberships} />
          <div className="ml-auto flex items-center space-x-6">
            <UpdatesPopover />
            <UserNav user={currentUser.user} />
          </div>
        </div>
        <div className="flex h-16 items-center px-8">
          <div className="flex w-full items-center justify-between space-x-6">
            <h2
              className="max-w-[400px] truncate text-2xl font-bold tracking-tight"
              title={title}
            >
              {title}
            </h2>
            {subMenu}
          </div>
        </div>
      </div>
      <div className="h-full flex-1 space-y-4 bg-gray-50 p-8 pt-6">
        {children}
      </div>
    </div>
  );
}
