import {Alert, AlertDescription, AlertTitle} from 'ui-core';

export function ValidationErrorMessage({
  errors = {},
}: {
  errors: Record<string, string>;
}) {
  const description =
    Object.keys(errors).length > 0
      ? Object.keys(errors).map((key) => {
          const message = errors[key];
          return (
            <li key={key}>
              <AlertDescription>{message}</AlertDescription>
            </li>
          );
        })
      : null;

  return (
    <Alert variant="destructive">
      <AlertTitle>Something went wrong</AlertTitle>
      {description}
    </Alert>
  );
}

export function UknownErrorMessage() {
  return (
    <Alert variant="destructive">
      <AlertTitle>Something went wrong</AlertTitle>
    </Alert>
  );
}
