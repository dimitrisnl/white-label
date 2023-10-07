import {Link} from '@remix-run/react';
import {
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core';

export function NoInvitations() {
  return (
    <Card className="max-w-[500px]">
      <CardHeader>
        <CardTitle className="text-center text-xl">
          Request invite from your team
        </CardTitle>
        <CardDescription className="text-center">
          We searched everywhere, but couldn't find any invites for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2 text-center">
        <div className="text-lg">
          Please request an invite from your team. They can do this under:
        </div>

        <div className="font-medium">Settings &gt; Invitations</div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to="/onboarding" className={buttonVariants({variant: 'ghost'})}>
          Back
        </Link>
      </CardFooter>
    </Card>
  );
}
