import {FaceFrownIcon} from '@heroicons/react/24/outline';

export function NoInvitations() {
  return (
    <div>
      <div className="space-y-6 text-gray-700">
        <div className="inline-flex rounded-full bg-gray-100 p-2">
          <FaceFrownIcon className="h-10 w-10 text-gray-500" />
        </div>
        <p>
          We searched everywhere, but there are no invites for you at the moment
        </p>
      </div>
    </div>
  );
}
