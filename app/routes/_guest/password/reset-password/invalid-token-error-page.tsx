import {XCircleIcon} from '@heroicons/react/24/outline';
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

export function InvalidTokenErrorPage() {
  return (
    <GuestLayout>
      <Card className="w-[420px] text-center">
        <CardHeader className="flex flex-col items-center justify-center">
          <XCircleIcon className="mb-4 h-10 w-10 stroke-red-600" />
          <CardTitle>Cannot reset password</CardTitle>
          <CardDescription>
            Your password reset link is either <strong>invalid</strong> or has{' '}
            <strong>expired</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center text-gray-700">
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
