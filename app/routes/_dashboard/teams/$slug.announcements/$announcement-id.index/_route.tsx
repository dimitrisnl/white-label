import {ArrowUturnLeftIcon} from '@heroicons/react/24/solid';
import {Link, useParams} from '@remix-run/react';
import React from 'react';
import {useTypedFetcher, useTypedLoaderData} from 'remix-typedjson';
import {toast} from 'sonner';

import {PageSkeleton} from '~/components/page-skeleton.tsx';
import {Button, buttonVariants} from '~/components/ui/button.tsx';
import {Input} from '~/components/ui/input.tsx';
import {Label} from '~/components/ui/label.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select.tsx';
import {Textarea} from '~/components/ui/textarea.tsx';

import type {EditAnnouncementAction} from './_action.server.ts';
import type {AnnouncementLoaderData} from './_loader.server';
export {action} from './_action.server.ts';
export {loader} from './_loader.server.ts';

export default function Page() {
  const params = useParams();
  const formRef = React.useRef<HTMLFormElement>(null);
  const {Form, state, data} = useTypedFetcher<
    EditAnnouncementAction | undefined
  >();

  const {
    data: {announcement},
  } = useTypedLoaderData<AnnouncementLoaderData>();

  React.useEffect(() => {
    if (data?.ok === true) {
      toast.success('Announcement edited');
    } else if (data?.ok === false) {
      const message =
        data.errors[0] ?? 'There was an error editing the announcement';
      toast.error(message);
    }
  }, [data]);

  const slug = params.slug!;

  return (
    <PageSkeleton
      header="Edit announcement"
      description="Edit the announcement"
      actionsSlot={
        <Link
          to={`/teams/${slug}/announcements`}
          className={buttonVariants({variant: 'outline'})}
        >
          <ArrowUturnLeftIcon className="mr-2 h-4 w-4" />
          All announcements
        </Link>
      }
    >
      <Form method="post" ref={formRef}>
        <div className="max-w-4xl space-y-4">
          <div className="flex max-w-48 flex-col space-y-2">
            <Label htmlFor="title">Status</Label>
            <Select
              name="status"
              disabled={state === 'submitting'}
              defaultValue={announcement.status}
            >
              <SelectTrigger>
                <SelectValue placeholder="DRAFT" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              disabled={state === 'submitting'}
              required
              minLength={2}
              maxLength={100}
              defaultValue={announcement.title}
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              name="content"
              id="content"
              className="min-h-64"
              disabled={state === 'submitting'}
              required
              minLength={2}
              defaultValue={announcement.content}
            />
          </div>
          <div>
            <Button
              type="submit"
              // disabled={state === 'submitting'}
            >
              Save changes
            </Button>
          </div>
        </div>
      </Form>
    </PageSkeleton>
  );
}
