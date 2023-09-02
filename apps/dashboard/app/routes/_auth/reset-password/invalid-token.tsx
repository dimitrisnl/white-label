import {Link} from '@remix-run/react';
import {
  buttonVariants,
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@white-label/ui-core';
import {MailWarningIcon} from 'lucide-react';

export function InvalidToken() {
  return (
    <Card className="w-[480px] border-t-4 border-t-blue-700 p-2">
      <CardHeader>
        <div className="mb-4 h-10 w-10 rounded-full bg-red-100 p-2">
          <MailWarningIcon className="h-full w-full text-red-600" />
        </div>
        <CardTitle>Cannot reset password</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 text-gray-700">
        <p>
          Your password reset link is <strong>invalid</strong> or has{' '}
          <strong>expired</strong>.
        </p>
        <p>You can request a new one by clicking the button below.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Link to="/login" className={buttonVariants({variant: 'link'})}>
          Back to Login
        </Link>
        <Link
          to="/forgot-password"
          className={buttonVariants({variant: 'default'})}
        >
          Request a new Password Reset link
        </Link>
      </CardFooter>
    </Card>
  );
}
