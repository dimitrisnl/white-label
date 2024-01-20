import {CubeIcon} from '@heroicons/react/24/outline';
import {Link} from '@remix-run/react';
// import {Input} from '@white-label/ui-core/input';
import React from 'react';

import {MainNav} from './main-nav';
import {VerifyEmailBanner} from './verify-email-banner';

function Sidebar({
  children,
  teamSelector,
}: {
  children: React.ReactNode;
  teamSelector: React.ReactNode;
}) {
  return (
    <div className="flex h-full min-h-screen w-72 flex-col gap-y-4 overflow-y-auto px-6 pb-4">
      <Link
        className="flex h-16 shrink-0 items-center space-x-2 pt-4 text-2xl font-bold leading-none text-gray-700"
        to="/"
      >
        <CubeIcon className="h-8 w-8 rounded-lg border border-gray-300 bg-gray-200 p-1 text-gray-700" />{' '}
        <div className="leading-none">White label</div>
      </Link>
      {teamSelector}
      {children}
      {/* <Input placeholder="Search" /> */}
      <VerifyEmailBanner />
    </div>
  );
}

function MainContent({children}: {children: React.ReactNode}) {
  return (
    <div className="min-h-screen flex-1 p-2">
      <div className="relative h-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow">
        <main>{children}</main>
      </div>
    </div>
  );
}

export function BaseLayout({
  children,
  teamSelector,
}: {
  children: React.ReactNode;
  teamSelector: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar teamSelector={teamSelector}>
        <MainNav />
      </Sidebar>
      <MainContent>{children}</MainContent>
    </div>
  );
}
