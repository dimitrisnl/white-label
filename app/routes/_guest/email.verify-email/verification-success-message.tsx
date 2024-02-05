import {CheckCircleIcon} from '@heroicons/react/24/outline';
import {Link} from '@remix-run/react';

import {GenericLayout} from '~/components/guest-layout.tsx';
import {buttonVariants} from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export function VerificationSuccessMessage() {
  return (
    <GenericLayout>
      <Card className="w-[400px] text-center">
        <CardHeader className="flex flex-col items-center justify-center text-center">
          <CheckCircleIcon className="mb-4 h-10 w-10 stroke-green-600" />
          <CardTitle>Your email has been verified</CardTitle>
          <CardDescription>You can close this tab if you want</CardDescription>
        </CardHeader>
        <CardContent></CardContent>
        <CardFooter className="flex justify-center">
          <Link to="/login" className={buttonVariants({variant: 'default'})}>
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </GenericLayout>
  );
}
