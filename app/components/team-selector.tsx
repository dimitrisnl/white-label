import {useNavigate, useParams} from '@remix-run/react';
import clsx from 'clsx';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select';
import type {Membership} from '~/core/domain/membership.server';

import {buttonVariants} from './ui/button';

export function TeamSelector({memberships}: {memberships: Array<Membership>}) {
  const params = useParams();
  const slug = params.slug!;

  const navigate = useNavigate();

  return (
    <Select
      defaultValue={slug}
      onValueChange={(slug) => {
        navigate(`/teams/${slug}`);
      }}
    >
      <SelectTrigger
        className={clsx(
          buttonVariants({variant: 'outline'}),
          'justify-between'
        )}
      >
        <SelectValue placeholder="Select a team" />
      </SelectTrigger>
      <SelectContent>
        {memberships.map((membership) => (
          <SelectItem value={membership.org.slug} key={membership.org.slug}>
            {membership.org.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
