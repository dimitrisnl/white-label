import {BellIcon} from '@heroicons/react/24/outline';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@white-label/ui-core/popover';
import React from 'react';

import {UserNav} from '@/components/user-nav.tsx';
import type {Membership, User} from '@/modules/domain/index.server.ts';

import {MainNav} from './main-nav.tsx';

function UpdatesPopover() {
  return (
    <Popover>
      <PopoverTrigger className="-m-2.5 p-2.5">
        <span className="sr-only">View notifications</span>
        <BellIcon className="h-5 w-5 stroke-gray-600" />
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
  navigationMenu,
}: {
  children: React.ReactNode;
  currentUser: {user: User.User; memberships: Array<Membership.Membership>};
  navigationMenu: Array<{
    name: string;
    href: string;
    icon: React.ElementType;
    end: boolean;
  }>;
}) {
  return (
    <>
      <div>
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center text-2xl font-bold">
              White Label
            </div>
            <MainNav
              memberships={currentUser.memberships}
              navigationMenu={navigationMenu}
            />
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
