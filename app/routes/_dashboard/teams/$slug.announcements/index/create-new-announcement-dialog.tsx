import {PlusIcon} from '@heroicons/react/24/outline';
import React from 'react';
import {useTypedFetcher} from 'remix-typedjson';
import {toast} from 'sonner';

import {Button} from '~/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog.tsx';
import {Input} from '~/components/ui/input.tsx';
import {Label} from '~/components/ui/label.tsx';
import {Textarea} from '~/components/ui/textarea.tsx';

import type {CreateAnnouncementAction} from './_action.server';

export function CreateNewAnnouncementDialog() {
  const [open, setOpen] = React.useState(false);

  const {Form, state, data} = useTypedFetcher<
    CreateAnnouncementAction | undefined
  >();

  React.useEffect(() => {
    if (data?.ok === true) {
      setOpen(false);
    } else if (data?.ok === false) {
      const message =
        data.errors[0] ?? 'There was an error creating the announcement';
      toast.error(message);
    }
  }, [data]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon className="mr-2 h-4 w-4" />
          New announcement
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>New announcement</DialogTitle>
        </DialogHeader>
        <Form method="post">
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                disabled={state === 'submitting'}
                required
                minLength={2}
                maxLength={100}
              />
            </div>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                name="content"
                id="content"
                className="min-h-48"
                disabled={state === 'submitting'}
                required
                minLength={2}
              />
            </div>
            <div className="flex justify-between">
              <Button
                type="button"
                disabled={state === 'submitting'}
                variant="ghost"
                onClick={() => {
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={state === 'submitting'}>
                Save changes
              </Button>
            </div>
          </div>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
