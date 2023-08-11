import {Alert, AlertDescription, AlertTitle} from '@white-label/ui-core';

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
            <li key={key} className="flex">
              <AlertDescription className="inline-block">
                {message}
              </AlertDescription>
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

export function UnknownErrorMessage() {
  return (
    <Alert variant="destructive">
      <AlertTitle className="mb-0">Something went wrong</AlertTitle>
    </Alert>
  );
}
