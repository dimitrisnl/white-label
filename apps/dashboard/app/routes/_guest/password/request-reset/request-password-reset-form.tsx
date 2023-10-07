import {Form, Link} from '@remix-run/react';
import {
  Button,
  buttonVariants,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@white-label/ui-core';
import {useTypedActionData} from 'remix-typedjson';

import {ErrorMessage} from '@/components/error-feedback';

import type {RequestPasswordResetAction} from './_action.server';

export function RequestPasswordResetForm() {
  const data = useTypedActionData<RequestPasswordResetAction>();

  if (data?.ok === true) {
    return (
      <Card className="w-[480px] border-t-4 border-t-blue-700">
        <CardHeader>
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
      <Card className="w-[480px] border-t-4 border-t-blue-700">
        <CardHeader>
          <CardTitle>Forgot your password?</CardTitle>
          <CardDescription className="pr-12">
            No worries, we'll send you detailed instructions on your email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
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

            {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Link
            to="/login"
            className={buttonVariants({variant: 'link'})}
            tabIndex={-1}
          >
            Back to Login
          </Link>
          <Button>Reset Password</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
