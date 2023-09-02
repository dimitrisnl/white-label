import {useNavigate} from '@remix-run/react';
import {
  Button,
  cn,
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@white-label/ui-core';
import {CheckIcon, ChevronsUpDownIcon} from 'lucide-react';
import * as React from 'react';

import type {Membership} from '@/modules/domain/index.server';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

export default function TeamSwitcher({
  className,
  memberships,
}: PopoverTriggerProps & {memberships: Array<Membership.Membership>}) {
  const groups = [
    {
      label: 'Teams',
      teams: memberships.map((membership) => ({
        label: membership.org.name,
        value: membership.org.id,
      })),
    },
  ];

  const [open, setOpen] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState<{
    label: string;
    value: string;
  }>(groups[0].teams[0]);

  const navigate = useNavigate();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a team"
          className={cn('w-[200px] text-left', className)}
        >
          <div className="truncate pr-2">{selectedTeam.label}</div>
          <ChevronsUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            {groups.map((group) => (
              <CommandGroup key={group.label} heading={group.label}>
                {group.teams.map((team) => (
                  <CommandItem
                    key={team.value}
                    onSelect={() => {
                      setSelectedTeam(team);
                      setOpen(false);
                      navigate(`/teams/${team.value}`);
                    }}
                    className="text-sm"
                  >
                    <div className="truncate pr-2">{team.label}</div>
                    <CheckIcon
                      className={cn(
                        'ml-auto h-4 w-4',
                        selectedTeam.value === team.value
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
