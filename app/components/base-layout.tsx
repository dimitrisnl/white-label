import {CubeIcon} from '@heroicons/react/24/outline';
import {Link} from '@remix-run/react';
import React from 'react';

import type {User} from '~/core/domain/user.server';

import {MainNav} from './main-nav';
import {ThemeToggle} from './theme-toggle';

function Sidebar({
  children,
  teamSelector,
}: {
  children: React.ReactNode;
  teamSelector: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-screen w-72 flex-col gap-y-4 overflow-y-auto px-4 pb-4">
      <div className="flex h-16 items-center justify-between pt-4">
        <Link
          className="flex shrink-0 items-center space-x-2 text-2xl font-bold leading-none text-gray-700 dark:text-gray-200"
          to="/"
        >
          <CubeIcon className="h-8 w-8 rounded-lg border border-gray-300 bg-gray-200 p-1 text-gray-700 dark:border-white/5 dark:bg-gray-800 dark:text-gray-200" />{' '}
          <div className="leading-none">White label</div>
        </Link>
        <ThemeToggle />
      </div>
      {teamSelector}
      {children}
    </div>
  );
}

function MainContent({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen flex-1 p-2">
      <div className="relative h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow dark:border-white/5 dark:bg-gray-900/10 dark:shadow-none">
        <main className="h-full">{children}</main>
      </div>
    </div>
  );
}

export function BaseLayout({
  children,
  teamSelector,
  user,
}: {
  children: React.ReactNode;
  teamSelector: React.ReactNode;
  user: User;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-black/5">
      <Sidebar teamSelector={teamSelector}>
        <MainNav user={user} />
      </Sidebar>
      <MainContent>{children}</MainContent>
    </div>
  );
}
