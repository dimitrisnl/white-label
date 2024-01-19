import {Form, Link} from '@remix-run/react';
import {Button, buttonVariants} from '@white-label/ui-core/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core/card';
import {Input} from '@white-label/ui-core/input';
import {Label} from '@white-label/ui-core/label';
import {cn} from '@white-label/ui-core/utils';
import {useTypedActionData} from 'remix-typedjson';

import {ErrorMessage} from '~/components/error-feedback.tsx';

import type {RequestPasswordResetAction} from './_action.server.ts';

export function RequestPasswordResetForm() {
  const data = useTypedActionData<RequestPasswordResetAction>();

  if (data?.ok === true) {
    return (
      <Card className="w-[420px]">
        <CardHeader className="text-center">
          <CardTitle>Email sent</CardTitle>
        </CardHeader>
        <CardContent>
          We've sent you an email with a link to reset your password.
        </CardContent>
        <CardFooter className="flex justify-end">
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
