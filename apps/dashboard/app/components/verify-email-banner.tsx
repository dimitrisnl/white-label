import {Button} from '@white-label/ui-core/button';

export function VerifyEmailBanner() {
  return (
    <div className="space-y-2 rounded-xl bg-orange-200 p-4 text-center">
      <p className="text-balance text-sm font-medium text-gray-900">
        You haven't verified your email address
      </p>
      <p className="text-balance text-xs">
        Please check your email for a verification link
      </p>
      <Button size="sm" className="w-full" variant="secondary">
        Resend verification email
      </Button>
    </div>
  );
}
