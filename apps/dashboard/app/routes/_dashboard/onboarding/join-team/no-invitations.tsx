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
        <div className="inline-block rounded-sm bg-blue-50 px-2 py-1 font-medium">
          Team Settings &gt; Invitations
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
