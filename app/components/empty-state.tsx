import {LightBulbIcon, PlusIcon} from '@heroicons/react/24/outline';

import {Button} from './ui/button';

export function EmptyState({
  title,
  description,
  cta,
  onClick,
}: {
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
}) {
  return (
    <div className="text-center">
      <LightBulbIcon className="mx-auto h-10 w-10 text-gray-400 dark:text-gray-600" />
      <h3 className="mt-2 text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">
        <Button type="button" variant="default" onClick={onClick}>
          <PlusIcon className="mr-2 h-4 w-4" aria-hidden="true" />
          <div>{cta}</div>
        </Button>
      </div>
    </div>
  );
}
