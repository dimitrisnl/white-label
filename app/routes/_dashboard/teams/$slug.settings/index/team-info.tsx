import React from 'react';
import {useTypedFetcher} from 'remix-typedjson';

import {ErrorMessage} from '~/components/error-feedback.tsx';
import {Button} from '~/components/ui/button';
import {Input} from '~/components/ui/input';
import {Label} from '~/components/ui/label';
import {toast} from '~/components/ui/toast';

import type {EditOrgAction} from './_action.server.ts';

export function TeamInfo({initialName}: {initialName: string}) {
  const {Form, state, data} = useTypedFetcher<EditOrgAction | undefined>();

  React.useEffect(() => {
    if (data?.ok === true) {
      toast.success('Team name changed');
    }
  }, [data]);

  return (
    <Form method="patch">
      <div className="max-w-96 space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="name">Team Name</Label>
          <Input
            id="name"
            name="name"
            placeholder=""
            type="text"
            defaultValue={initialName}
            disabled={state !== 'idle'}
            minLength={2}
            required
          />
        </div>
        <Button
          name="formName"
          value="EDIT_ORG_FORM"
          disabled={state !== 'idle'}
        >
          Create new team
        </Button>
        {data?.ok === false ? <ErrorMessage errors={data.errors} /> : null}
      </div>
    </Form>
  );
}
