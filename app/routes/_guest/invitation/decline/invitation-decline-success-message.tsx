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

export function InvitationDeclineSuccessMessage() {
  return (
    <GuestLayout>
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Invitation declined</CardTitle>
          <CardDescription>Nothing else needed</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            You have declined this invitation. You can leave this page.
          </p>
        </CardContent>
        <CardFooter>
          <Link to="/login" className={buttonVariants({variant: 'link'})}>
            Go to Login
          </Link>
        </CardFooter>
      </Card>
    </GuestLayout>
  );
}
