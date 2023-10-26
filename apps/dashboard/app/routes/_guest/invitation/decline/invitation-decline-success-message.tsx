import {Link} from '@remix-run/react';
import {buttonVariants} from '@white-label/ui-core/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core/card';

import {GuestLayout} from '@/components/guest-layout.tsx';

export function InvitationDeclineSuccessMessage() {
  return (
    <GuestLayout>
      <Card className="w-[480px] border-t-4 border-t-blue-700">
        <CardHeader>
          <CardTitle>Invitation declined</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">You have declined this invitation.</p>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Link to="/login" className={buttonVariants({variant: 'default'})}>
            Go to Login
          </Link>
        </CardFooter>
      </Card>
    </GuestLayout>
  );
}
