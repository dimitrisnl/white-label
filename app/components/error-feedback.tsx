import {Alert, AlertDescription, AlertTitle} from '~/components/ui/alert';

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
