import {Link} from '@remix-run/react';
import React from 'react';
import {cn} from 'ui-core';

import {UserNav} from '@/components/user-nav';
import {useUser} from '@/lib/user';

function MainNav({className, ...props}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn('flex items-center space-x-4 lg:space-x-6', className)}
      {...props}
    >
      <Link
        to="/"
        className="hover:text-primary text-sm font-medium transition-colors"
      >
        Overview
      </Link>
      <Link
        to="/teams"
        className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
      >
        Teams
      </Link>
      <Link
        to="/settings"
        className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors"
      >
        Settings
      </Link>
    </nav>
  );
}

export function BaseLayout({
  children,
  title,
  titleSlot,
}: {
  children: React.ReactNode;
  title: string;
  titleSlot?: React.ReactNode;
}) {
  const user = useUser();

  return (
    <div className="flex min-h-screen flex-col">
      <div className="border-b shadow-2xl">
        <div className="flex h-16 items-center border-b px-4">
          <h1 className="text-2xl font-bold tracking-tight">White Label</h1>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav user={user} />
          </div>
        </div>
        <div className="50 flex h-16 items-center px-8">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
            {titleSlot}
          </div>
        </div>
      </div>
      <div className="flex-1 space-y-4 bg-gray-50 p-8 pt-6">{children}</div>
    </div>
  );
}
