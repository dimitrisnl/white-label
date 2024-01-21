import {json} from '@remix-run/node';
import {Link} from '@remix-run/react';

import {GuestLayout} from '~/components/guest-layout.tsx';
import {buttonVariants} from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {cn} from '~/utils/classname-utils';

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
