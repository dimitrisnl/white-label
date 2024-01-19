import ArrowLongRightIcon from '@heroicons/react/16/solid/ArrowLongRightIcon';
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
import {PasswordInput} from '@white-label/ui-core/password-input';
import {cn} from '@white-label/ui-core/utils';
import {useTypedFetcher} from 'remix-typedjson';

import {ErrorMessage} from '~/components/error-feedback.tsx';

import type {LoginRequestAction} from './_action.server.ts';

export function LoginForm() {
  const {Form, data, state} = useTypedFetcher<LoginRequestAction | undefined>();

  return (
    <Form method="post">
      <Card className="w-[420px]">
        <CardHeader className="text-center">
          <CardTitle>Welcome back!</CardTitle>
          <CardDescription>Please login to continue</CardDescription>
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
                    'h-auto p-0 text-xs text-gray-700'
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
            <Button className="space-x-2">
              <div>Continue</div>
              <ArrowLongRightIcon className="h-4 w-4 text-gray-300" />
            </Button>
            {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-items-center py-2 text-xs">
          <div className="flex w-full items-center justify-center space-x-1">
            <div className="text-gray-700">Don't have an account yet?</div>
            <Link
              to="/register"
              className={cn(
                buttonVariants({variant: 'link'}),
                'p-0 text-xs font-semibold text-gray-700'
              )}
              tabIndex={-1}
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Form>
  );
}
