import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import {Link} from '@remix-run/react';
import {buttonVariants} from '@white-label/ui-core/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core/card';

import {GuestLayout} from '~/components/guest-layout.tsx';

export function InvalidTokenErrorMessage() {
  return (
    <GuestLayout>
      <Card className="w-[480px] border-t-4 border-t-blue-700">
        <CardHeader>
          <div className="mb-4 h-10 w-10 rounded-full bg-red-100 p-2">
            <ExclamationTriangleIcon className="h-full w-full text-red-600" />
          </div>
          <CardTitle>Email verification failed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-gray-700">
          <p>
            Your email verification link is <strong>invalid</strong> or has{' '}
            <strong>expired</strong>.
          </p>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Link to="/login" className={buttonVariants({variant: 'default'})}>
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </GuestLayout>
  );
}
