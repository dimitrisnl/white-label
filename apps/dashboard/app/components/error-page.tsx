import {Link} from '@remix-run/react';
import {
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core';

import {GuestLayout} from './layouts/guest-layout';

export function ErrorPage({
  statusCode = 500,
  messages = [
    "We couldn't process your request. We are working on resolving the issue.",
  ],
}: {
  statusCode?: number;
  messages?: Array<string>;
}) {
  return (
    <GuestLayout>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <Card className="min-w-[400px] border-t-4 border-t-blue-700 p-2">
          <CardHeader>
            <CardDescription>{statusCode}</CardDescription>
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>{messages}</CardContent>
          <CardFooter className="justify-center">
            <Link to="/" className={buttonVariants({variant: 'default'})}>
              Back to Home
            </Link>
          </CardFooter>
        </Card>
      </div>
    </GuestLayout>
  );
}
