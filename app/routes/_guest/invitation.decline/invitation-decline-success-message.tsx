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

export function InvitationDeclineSuccessMessage() {
  return (
    <GenericLayout>
      <Card className="text-center">
        <CardHeader>
          <CardTitle>Invitation declined</CardTitle>
          <CardDescription>Nothing else needed</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          You have declined this invitation. You can leave this page.
        </CardContent>
        <CardFooter>
          <Link to="/login" className={buttonVariants({variant: 'link'})}>
            Go to Login
          </Link>
        </CardFooter>
      </Card>
    </GenericLayout>
  );
}
