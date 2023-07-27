import {useNavigate} from '@remix-run/react';
import {CheckIcon, ChevronsUpDownIcon} from 'lucide-react';
import * as React from 'react';
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
} from 'ui-core';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
>;

interface TeamSwitcherProps extends PopoverTriggerProps {
  orgs: Array<{
    id: string;
    name: string;
    membership: {
      role: string;
    };
  }>;
}

export default function TeamSwitcher({className, orgs}: TeamSwitcherProps) {
  const groups = [
    {
      label: 'Teams',
      teams: orgs.map((org) => ({
        label: org.name,
        value: org.id,
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
