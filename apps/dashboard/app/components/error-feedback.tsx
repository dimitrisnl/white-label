import {Alert, AlertDescription, AlertTitle} from 'ui-core';

export function ErrorFeedback({
  errors = {},
}: {
  errors?: Record<string, string>;
}) {
  const description =
    Object.keys(errors).length > 0 ? (
      Object.keys(errors).map((key) => {
        const message = errors[key];
        return (
          <li key={key}>
            <AlertDescription>{message}</AlertDescription>
          </li>
        );
      })
    ) : (
      <AlertDescription>Let's try again, shall we?</AlertDescription>
    );

  return (
    <Alert variant="destructive">
      <AlertTitle>Something went wrong</AlertTitle>
      <ul className="list-disc pl-4">{description}</ul>
    </Alert>
  );
}
