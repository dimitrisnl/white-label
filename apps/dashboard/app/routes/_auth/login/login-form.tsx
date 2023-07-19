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
  cn,
  Input,
  Label,
} from 'ui-core';

import {ErrorFeedback} from '@/components/error-feedback';

type Data = {ok: false; messageObject: Record<string, string>} | undefined;

export function LoginForm() {
  const {Form, data, state} = useFetcher<Data>();

  return (
    <Form action="/login" method="post">
      <Card className="w-[480px] border-t-4 border-t-blue-700 p-2">
        <CardHeader>
          <CardTitle>Log in to your account</CardTitle>
          <CardDescription>Welcome back!</CardDescription>
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
            <div className="flex flex-col space-y-2">
              <div className="flex items-end justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/forgot-password"
                  className={cn(
                    buttonVariants({variant: 'link'}),
                    'h-auto p-0'
                  )}
                  tabIndex={-1}
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                placeholder="Your password"
                type="password"
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
            to="/register"
            className={buttonVariants({variant: 'link'})}
            tabIndex={-1}
          >
            Don't have an account yet?
          </Link>
          <Button>Login</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
