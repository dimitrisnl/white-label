import {Link} from '@remix-run/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core/card';
import {useTypedFetcher} from 'remix-typedjson';

import {ErrorMessage} from '@/components/error-feedback.tsx';
import {PasswordInput} from '@/components/password-input.tsx';

import type {RegisterRequestAction} from './_action.server.ts';
import {Label} from '@white-label/ui-core/label';
import {Input} from '@white-label/ui-core/input';
import {Button, buttonVariants} from '@white-label/ui-core/button';

export function RegisterForm() {
  const {Form, data, state} = useTypedFetcher<
    RegisterRequestAction | undefined
  >();

  return (
    <Form method="post">
      <Card className="w-[480px] border-t-4 border-t-blue-700">
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>
            Welcome! A few details before we proceed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Your full name"
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
                placeholder="Your email"
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
                placeholder="Your password"
                disabled={state !== 'idle'}
                minLength={8}
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
            Already having an account?
          </Link>
          <Button disabled={state !== 'idle'}>Create account</Button>
        </CardFooter>
      </Card>
    </Form>
  );
}
