import {XCircleIcon} from '@heroicons/react/24/outline';
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

import {GuestLayout} from '~/components/guest-layout.tsx';

export function InvalidTokenErrorPage() {
  return (
    <GuestLayout>
      <Card className="w-[420px] text-center">
        <CardHeader>
          <CardTitle>Cannot reset password</CardTitle>
          <CardDescription>The process could not be completed</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center text-gray-700">
          <p>
            Your password reset link is <strong>invalid</strong> or has{' '}
            <strong>expired</strong>.
          </p>
          <XCircleIcon className="h-12 w-12 stroke-red-600" />

          <Link
            to="/password/request-reset"
            className={buttonVariants({variant: 'default'})}
          >
            Request a new password reset link
          </Link>
        </CardContent>
        <CardFooter>
          <Link to="/login" className={buttonVariants({variant: 'link'})}>
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </GuestLayout>
  );
}
