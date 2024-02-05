import {FaceFrownIcon} from '@heroicons/react/24/outline';

export function NoInvitations() {
  return (
    <div>
      <div className="space-y-6 text-gray-700 dark:text-gray-300">
        <div className="inline-flex rounded-full bg-gray-100 p-2 dark:bg-gray-900">
          <FaceFrownIcon className="h-10 w-10 text-gray-500 dark:text-gray-400" />
        </div>
        <div>
          We searched everywhere, but there are no invites for you at the moment
        </div>
      </div>
    </div>
  );
}
