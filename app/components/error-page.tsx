import {Link} from '@remix-run/react';

import {buttonVariants} from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

import {GuestLayout} from './guest-layout.tsx';

export function ErrorPage({
  statusCode = 500,
  messages = [
    "We couldn't process your request. Don't worry, we're notified and we'll resolve whatever caused this.",
  ],
}: {
  statusCode?: number;
  messages?: Array<string>;
}) {
  return (
    <GuestLayout>
      <div className="flex h-full flex-col items-center justify-center text-center">
        <Card className="max-w-[420px]">
          <CardHeader>
            <CardDescription>{statusCode}</CardDescription>
            <CardTitle>Something went wrong</CardTitle>
          </CardHeader>
          <CardContent className="text-md text-balance">{messages}</CardContent>
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
