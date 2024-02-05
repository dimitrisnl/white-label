import {ArrowLongRightIcon} from '@heroicons/react/24/solid';
import {Link} from '@remix-run/react';

import {buttonVariants} from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export function NoInvitations() {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle>No Invitations found</CardTitle>
        <CardDescription>
          We searched everywhere, but couldn't find any invites for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-1 text-sm">
        <div>
          Please request an invite from your team. They can do this under:
        </div>
        <div className="inline-flex items-center justify-center space-x-2 rounded-sm bg-blue-50 px-2 py-1 font-medium dark:bg-blue-900">
          <div>Team Settings</div> <ArrowLongRightIcon className="h-4 w-4" />{' '}
          <div>Invitations</div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/onboarding" className={buttonVariants({variant: 'link'})}>
          Go back
        </Link>
      </CardFooter>
    </Card>
  );
}
