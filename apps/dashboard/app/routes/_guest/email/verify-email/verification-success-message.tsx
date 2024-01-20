import {CheckCircleIcon} from '@heroicons/react/24/outline';
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

export function VerificationSuccessMessage() {
  return (
    <GuestLayout>
      <Card className="w-[400px] text-center">
        <CardHeader>
          <CardTitle>Success</CardTitle>
          <CardDescription>Everything went well</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center text-gray-700">
          <div>Your email has been verified</div>
          <CheckCircleIcon className="h-12 w-12 stroke-green-600" />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className={buttonVariants({variant: 'default'})}>
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </GuestLayout>
  );
}
