import {Link} from '@remix-run/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core/card';

import {GuestLayout} from './guest-layout.tsx';
import {buttonVariants} from '@white-label/ui-core/button';

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
        <Card className="min-w-[400px] border-t-4 border-t-blue-700">
          <CardHeader>
            <CardDescription>{statusCode}</CardDescription>
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent>{messages}</CardContent>
          <CardFooter className="justify-center">
            <Link to="/teams" className={buttonVariants({variant: 'default'})}>
              Back to Home
            </Link>
          </CardFooter>
        </Card>
      </div>
    </GuestLayout>
  );
}
