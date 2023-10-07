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

export function OnboardingSwitch() {
  return (
    <div className="grid max-w-[1000px] grid-cols-2 gap-8">
      <Card className="min-w-[400px]">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            I want to create a new team
          </CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="text-center text-gray-800 ">
          If you're new to WhiteLabel, you need to set up a team first. This
          will allow you to invite other and collaborate
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            to="/onboarding/create-new-team"
            className={buttonVariants({variant: 'default'})}
          >
            Create new team
          </Link>
        </CardFooter>
      </Card>
      <Card className="min-w-[400px]">
        <CardHeader>
          <CardTitle className="text-center text-xl">
            I want to join my team
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center text-gray-800 ">
          Are you joining an existing team? Let's figure out the next steps
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            to="/onboarding/join-team"
            className={buttonVariants({variant: 'secondary'})}
          >
            Join your team
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
