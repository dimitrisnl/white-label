import {useSearchParams} from '@remix-run/react';
import {Alert, AlertDescription, AlertTitle} from '@white-label/ui-core';

export function PasswordResetBanner() {
  const [params] = useSearchParams();

  if (params.get('resetPassword') === 'true') {
    return (
      <div className="mb-4">
        <Alert variant="success">
          <AlertTitle>Your password has been reset successfully!</AlertTitle>
          <AlertDescription>
            You can now log in with your new password.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return null;
}
