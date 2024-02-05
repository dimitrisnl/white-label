import {XCircleIcon} from '@heroicons/react/24/outline';
import {ChatBubbleBottomCenterIcon} from '@heroicons/react/24/solid';
import {Link} from '@remix-run/react';

import {GenericLayout} from '~/components/guest-layout.tsx';
import {Button, buttonVariants} from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export function InvalidTokenErrorMessage() {
  return (
    <GenericLayout>
      <Card className="w-[400px] text-center">
        <CardHeader>
          <CardTitle>Failure</CardTitle>
          <CardDescription>The process could not be completed</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center text-gray-700">
          <div>
            Your email verification link is either <strong>invalid</strong> or
            has <strong>expired</strong>.
          </div>
          <XCircleIcon className="h-12 w-12 stroke-red-600" />
          <Button className="w-full">
            <ChatBubbleBottomCenterIcon className="mr-2 h-4 w-4" />
            Contact us
          </Button>
        </CardContent>
        <CardFooter>
          <Link to="/login" className={buttonVariants({variant: 'link'})}>
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </GenericLayout>
  );
}
