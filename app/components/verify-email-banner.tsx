import {ExclamationTriangleIcon} from '@heroicons/react/24/outline';
import React from 'react';
import {useTypedFetcher} from 'remix-typedjson';
import {toast} from 'sonner';

import {Button} from '~/components/ui/button';
import type {ResendVerificationAction} from '~/routes/user.resend-verification/_action.server';

export function VerifyEmailBanner() {
  const {Form, state, data} = useTypedFetcher<
    ResendVerificationAction | undefined
  >();

  React.useEffect(() => {
    if (data?.ok === true) {
      toast.success('Verification email sent');
    } else if (data?.ok === false) {
      const message = data.errors[0] ?? 'Something went wrong';
      toast.error(message);
    }
  }, [data]);

  return (
    <Form
      method="post"
      action="/user/resend-verification"
      className="space-y-2 rounded-xl border border-transparent bg-orange-200 p-2 dark:border-white/5 dark:bg-gray-950"
    >
      <div className="px-2">
        <div className="flex space-x-4">
          <ExclamationTriangleIcon className="h-12 w-12 fill-orange-300 stroke-gray-800" />
          <div className="space-y-1 text-xs">
            <p className="text-balance text-sm font-medium text-gray-900 dark:text-white">
              You haven't verified your email address
            </p>
            <p className="text-balance dark:text-gray-200">
              Please check your email for a verification link
            </p>
          </div>
        </div>
      </div>
      <Button
        size="sm"
        className="w-full"
        variant="outline"
        disabled={state !== 'idle'}
      >
        Resend verification email
      </Button>
    </Form>
  );
}
