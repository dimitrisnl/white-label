import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import {Button} from '@white-label/ui-core/button';

export function VerifyEmailBanner() {
  return (
    <div>
      <div className="bg-black p-4">
        <div className="mx-auto w-full">
          <div className="flex w-full items-center justify-between">
            <div className="flex">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-3 space-y-px">
                <p className="text-sm font-medium text-yellow-500">
                  You haven't verified your email address
                </p>
                <p className="text-xs text-white">
                  Please check your email for a verification link
                </p>
              </div>
            </div>
            <div>
              <Button variant="secondary">Resend verification email</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
