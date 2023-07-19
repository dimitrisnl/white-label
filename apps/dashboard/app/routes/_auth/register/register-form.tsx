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

export function RegisterForm() {
  const {Form, data, state} = useFetcher();

  return (
    <Form action="/register" method="post">
      <Card className="w-[480px] border-t-4 border-t-blue-700 p-2">
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
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="password">Password</Label>
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
