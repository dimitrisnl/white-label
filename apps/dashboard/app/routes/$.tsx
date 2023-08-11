import {json} from '@remix-run/node';
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

import {GuestLayout} from '@/components/layouts/guest-layout';

export default function FourOhFour() {
  return (
    <GuestLayout>
      <div className="flex h-full flex-col items-center justify-center">
        <Card className="border-t-4 border-t-blue-700 p-2">
          <CardHeader>
            <CardTitle>Page not found</CardTitle>
            <CardDescription>404</CardDescription>
          </CardHeader>
          <CardContent>
            The page you requested was not found, or has been moved.
          </CardContent>
          <CardFooter>
            <Link to="/" className={buttonVariants({variant: 'default'})}>
              Back to Home
            </Link>
          </CardFooter>
        </Card>
      </div>
    </GuestLayout>
  );
}

export const loader = () => {
  return json(null, {status: 404});
};
