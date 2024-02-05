import {XCircleIcon} from '@heroicons/react/24/outline';
import {Link} from '@remix-run/react';

import {GenericLayout} from '~/components/guest-layout.tsx';
import {Button, buttonVariants} from '~/components/ui/button';
import {Card, CardContent, CardFooter} from '~/components/ui/card';

export function InvalidTokenErrorMessage() {
  return (
    <GenericLayout>
      <Card className="w-[400px] text-center">
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center text-muted-foreground">
          <XCircleIcon className="h-12 w-12 stroke-red-600" />
          <div>
            Your email verification link is either <strong>invalid</strong> or
            has <strong>expired</strong>.
          </div>
          <Button className="w-full">Contact us</Button>
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
