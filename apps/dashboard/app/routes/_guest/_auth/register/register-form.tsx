import ArrowLongRightIcon from '@heroicons/react/24/solid/ArrowLongRightIcon';
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

import type {RegisterRequestAction} from './_action.server.ts';

export function RegisterForm() {
  const {Form, data, state} = useTypedFetcher<
    RegisterRequestAction | undefined
  >();

  return (
    <Form method="post">
      <Card className="w-[420px]">
        <CardHeader className="text-center">
          <CardTitle>Create your account</CardTitle>
          <CardDescription>
            Welcome! Please fill in the details to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-6">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder=""
                disabled={state !== 'idle'}
                minLength={2}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                placeholder=""
                type="email"
                disabled={state !== 'idle'}
                required
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                name="password"
                placeholder=""
                disabled={state !== 'idle'}
                minLength={8}
                required
              />
            </div>
            <Button className="space-x-2">
              <div>Continue</div>
              <ArrowLongRightIcon className="h-4 w-4 text-gray-200" />
            </Button>
            {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-items-center py-2 text-xs">
          <div className="flex w-full items-center justify-center space-x-1">
            <div className="text-gray-700">Already have an account?</div>
            <Link
              to="/login"
              className={cn(
                buttonVariants({variant: 'link'}),
                'p-0 text-xs font-semibold text-gray-700'
              )}
              tabIndex={-1}
            >
              Log in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Form>
  );
}
