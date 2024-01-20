import {UserIcon, UsersIcon} from '@heroicons/react/24/solid';
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

export function OnboardingSwitch() {
  return (
    <div className="grid max-w-[1000px] grid-cols-2 gap-8">
      <Card className="text-center">
        <CardHeader>
          <CardTitle>I want to create a new team</CardTitle>
          <CardDescription>
            <div className="mt-4 inline-flex rounded-full bg-blue-100 p-2">
              <UserIcon className="h-8 w-8 fill-blue-400" />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-left text-gray-700">
          <ul className="w-80 max-w-sm list-inside list-disc text-sm">
            <li>You will be the owner of the team</li>
            <li>You can invite others to collaborate with you</li>
          </ul>
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
      <Card className="text-center">
        <CardHeader>
          <CardTitle>I want to join my team</CardTitle>
          <CardDescription>
            <div className="mt-4 inline-flex rounded-full bg-blue-100 p-2">
              <UsersIcon className="h-8 w-8 fill-blue-400" />
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-gray-700">
          <p>Are you joining an existing team?</p>
          <p>Let's look for your invitations..</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            to="/onboarding/join-team"
            className={buttonVariants({variant: 'default'})}
          >
            Find my team
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
