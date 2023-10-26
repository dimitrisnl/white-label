import {Link} from '@remix-run/react';
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
import {useTypedFetcher} from 'remix-typedjson';

import {ErrorMessage} from '@/components/error-feedback.tsx';
import {PasswordInput} from '@/components/password-input.tsx';

import type {LoginRequestAction} from './_action.server.ts';

export function LoginForm() {
  const {Form, data, state} = useTypedFetcher<LoginRequestAction | undefined>();

  return (
    <Form method="post">
      <Card className="w-[480px] border-t-4 border-t-blue-700">
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
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <div className="flex items-end justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/password/request-reset"
                  className={cn(
                    buttonVariants({variant: 'link'}),
                    'h-auto p-0'
                  )}
                  tabIndex={-1}
                >
                  Forgot your password?
                </Link>
              </div>
              <PasswordInput
                id="password"
                name="password"
                placeholder="Your password"
                disabled={state !== 'idle'}
                required
                minLength={8}
              />
            </div>
            {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
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
