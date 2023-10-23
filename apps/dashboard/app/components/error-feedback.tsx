import {Alert, AlertDescription, AlertTitle} from '@white-label/ui-core/alert';

export function ErrorMessage({errors}: {errors: Array<string>}) {
  return (
    <Alert variant="destructive">
      <AlertTitle className="mb-2">Something went wrong</AlertTitle>
      {errors.map((error) => (
        <li key={error} className="flex">
          <AlertDescription className="inline-block">{error}</AlertDescription>
        </li>
      ))}
    </Alert>
  );
}
