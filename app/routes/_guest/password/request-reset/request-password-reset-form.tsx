import {CheckCircleIcon} from '@heroicons/react/24/outline';
import {Form, Link} from '@remix-run/react';
import {useTypedActionData} from 'remix-typedjson';

import {ErrorMessage} from '~/components/error-feedback.tsx';
import {Button, buttonVariants} from '~/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import {Input} from '~/components/ui/input.tsx';
import {Label} from '~/components/ui/label.tsx';
import {cn} from '~/utils/classname-utils.ts';

import type {RequestPasswordResetAction} from './_action.server.ts';

export function RequestPasswordResetForm() {
  const data = useTypedActionData<RequestPasswordResetAction>();

  if (data?.ok === true) {
    return (
      <Card className="w-[420px]">
        <CardHeader className="text-center">
          <CardTitle>Email sent</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center gap-4 text-center text-gray-700">
          <div>We've sent you an email with a link to reset your password.</div>
          <CheckCircleIcon className="h-12 w-12 stroke-green-600" />
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            to="/login"
            className={buttonVariants({variant: 'default'})}
            tabIndex={-1}
          >
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Form method="post">
      <Card className="w-[420px]">
        <CardHeader className="text-balance text-center">
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription>
            No worries, we'll send you detailed instructions on your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder="Your email"
                type="email"
                required
              />
            </div>
            <Button>Reset Password</Button>
            {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-center ">
          <Link
            to="/login"
            className={cn(buttonVariants({variant: 'link'}), 'text-xs')}
            tabIndex={-1}
          >
            Back to Login
          </Link>
        </CardFooter>
      </Card>
    </Form>
  );
}
