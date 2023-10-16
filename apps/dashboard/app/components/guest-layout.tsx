import {CubeIcon} from '@heroicons/react/24/outline';
import React from 'react';

export function GuestLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex min-h-screen flex-col items-center gap-10 bg-slate-100 pt-16">
      <div className="flex flex-col items-center space-y-4 leading-none">
        <div className="h-12 w-12 rounded-full bg-blue-100 p-2">
          <CubeIcon className="h-full w-full text-blue-700" />
        </div>
        <h1 className="text-4xl font-bold">White Label</h1>
      </div>
      <div>{children}</div>
    </div>
  );
}
