import {Popover, PopoverContent, PopoverTrigger} from '@white-label/ui-core';
import {BellIcon, LayoutDashboardIcon} from 'lucide-react';
import React from 'react';

import {UserNav} from '@/components/user-nav';
import type {Membership, User} from '@/modules/domain/index.server';

import {MainNav} from './main-nav';

function UpdatesPopover() {
  return (
    <Popover>
      <PopoverTrigger className='hover:text-gray-500" -m-2.5 p-2.5 text-gray-400'>
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-5 w-5" aria-hidden="true" />
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end" forceMount>
        <div className="text-center text-xs text-gray-700">Nothing to show</div>
      </PopoverContent>
    </Popover>
  );
}

export function BaseLayout({
  children,
  currentUser,
}: {
  children: React.ReactNode;
  currentUser: {user: User.User; memberships: Array<Membership.Membership>};
}) {
  return (
    <>
      <div>
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center text-2xl font-bold">
              <LayoutDashboardIcon className="mr-2 h-6 w-6" /> White Label
            </div>
            <MainNav memberships={currentUser.memberships} />
          </div>
        </div>

        <div className="lg:pl-72">
          <div className="sticky top-0 z-40 border-b border-gray-200 bg-white px-8">
            <div className="flex h-16 items-center gap-x-4 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-0 lg:shadow-none">
              <div
                className="h-6 w-px bg-gray-200 lg:hidden"
                aria-hidden="true"
              />

              <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <div className="flex-1"></div>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                  <UpdatesPopover />

                  <div
                    className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200"
                    aria-hidden="true"
                  />

                  <UserNav user={currentUser.user} />
                </div>
              </div>
            </div>
          </div>

          <main className="py-10">
            <div className="px-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
