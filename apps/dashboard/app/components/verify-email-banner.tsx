import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import {Button} from '@white-label/ui-core/button';

export function VerifyEmailBanner() {
  return (
    <div className="space-y-2 rounded-xl bg-orange-200 p-2">
      <div className="px-2">
        <div className="flex space-x-4">
          <ExclamationTriangleIcon className="h-12 w-12 fill-orange-300 stroke-1" />
          <div className="space-y-1 text-xs">
            <p className="text-balance font-medium text-gray-900">
              You haven't verified your email address
            </p>
            <p className="text-balance">
              Please check your email for a verification link
            </p>
          </div>
        </div>
      </div>
      <Button size="sm" className="w-full" variant="secondary">
        Resend verification email
      </Button>
    </div>
  );
}
