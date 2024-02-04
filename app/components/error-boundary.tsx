import {isRouteErrorResponse, useRouteError} from '@remix-run/react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';

export function ErrorBox({
  statusCode = 500,
  messages = [
    "We couldn't process your request. Don't worry, we're notified and we'll resolve whatever caused this.",
  ],
}: {
  statusCode?: number;
  messages?: Array<string>;
}) {
  return (
    <div className="flex h-full flex-col items-center pt-8 text-center">
      <Card className="w-[420px]">
        <CardHeader>
          <CardDescription>{statusCode}</CardDescription>
          <CardTitle>Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-md text-balance text-muted-foreground">
          {messages}
        </CardContent>
      </Card>
    </div>
  );
}

export function BaseErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 500) {
      return <ErrorBox />;
    }

    return (
      // eslint-disable-next-line
      <ErrorBox statusCode={error.status} messages={error.data?.errors} />
    );
  }

  return <ErrorBox />;
}
