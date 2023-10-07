import {Link} from '@remix-run/react';
import {
  buttonVariants,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core';

import {GuestLayout} from '@/components/guest-layout';

export function VerificationSuccessMessage() {
  return (
    <GuestLayout>
      <Card className="w-[480px] border-t-4 border-t-blue-700">
        <CardHeader>
          <CardTitle>Success!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">Your email has been verified</p>
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
