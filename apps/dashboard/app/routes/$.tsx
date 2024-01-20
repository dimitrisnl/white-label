import {json} from '@remix-run/node';
import {Link} from '@remix-run/react';
import {buttonVariants} from '@white-label/ui-core/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core/card';
import {cn} from '@white-label/ui-core/utils';

import {GuestLayout} from '~/components/guest-layout.tsx';

export default function FourOhFour() {
  return (
    <GuestLayout>
      <div className="flex h-full flex-col items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader className="text-center">
            <CardTitle>Page not found</CardTitle>
            <CardDescription>404</CardDescription>
          </CardHeader>
          <CardContent className="text-pretty text-center text-sm">
            The page you requested was not found, or has been moved.
          </CardContent>
          <CardFooter>
            <Link
              to="/"
              reloadDocument
              className={cn(buttonVariants({variant: 'default'}), 'w-full')}
            >
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
