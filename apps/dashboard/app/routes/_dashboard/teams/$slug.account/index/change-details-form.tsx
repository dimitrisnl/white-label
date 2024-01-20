import {Button} from '@white-label/ui-core/button';
import {Input} from '@white-label/ui-core/input';
import {Label} from '@white-label/ui-core/label';
import {toast} from '@white-label/ui-core/toast';
import React from 'react';
import {useTypedFetcher} from 'remix-typedjson';

import {ErrorMessage} from '~/components/error-feedback.tsx';

import type {EditUserAction} from './_action.server.ts';

export function ChangeDetailsForm({
  initialName,
  initialEmail,
}: {
  initialName: string;
  initialEmail: string;
}) {
  const {Form, state, data} = useTypedFetcher<EditUserAction | undefined>();

  React.useEffect(() => {
    if (data?.ok) {
      toast.success('Name changed');
    }
  }, [data]);

  return (
    <Form method="patch">
      <div className="max-w-96 space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="team-name">Full Name</Label>
          <Input
            defaultValue={initialName}
            id="full-name"
            name="name"
            placeholder=""
            type="text"
            disabled={state !== 'idle'}
            minLength={2}
            required
          />
        </div>
        <div className="flex flex-col space-y-2">
          <Label htmlFor="team-name">Email</Label>
          <Input
            defaultValue={initialEmail}
            id="email"
            name="email"
            placeholder=""
            type="email"
            disabled={true}
            minLength={2}
            required
          />
        </div>
        <Button
          name="formName"
          value="CHANGE_NAME_FORM"
          disabled={state !== 'idle'}
        >
          Save
        </Button>
        {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
      </div>
    </Form>
  );
}
