import {Link, useFetcher} from '@remix-run/react';
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
} from 'ui-core';

import {ErrorFeedback} from '@/components/error-feedback';

export function ForgotPasswordForm() {
  const {Form, state, data} = useFetcher();

  if (data?.ok) {
    return (
      <Card className="w-[480px] border-t-4 border-t-blue-700 p-2">
        <CardHeader>
          <CardTitle>Email sent</CardTitle>
        </CardHeader>
        <CardContent>
          We've sent you an email with a link to reset your password.
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button>Back to Login</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Form action="/forgot-password" method="post">
      <Card className="w-[480px] border-t-4 border-t-blue-700 p-2">
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
                disabled={state !== 'idle'}
              />
            </div>

            {data?.ok === false ? (
              <ErrorFeedback errors={data.messageObject} />
            ) : null}
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
