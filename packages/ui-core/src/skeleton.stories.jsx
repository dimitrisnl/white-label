import {Skeleton} from './skeleton';

const meta = {
  title: 'Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

export const Base = {
  render: (args) => (
    <div className="flex items-center space-x-4">
      <Skeleton {...args} className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton {...args} className="h-4 w-[250px]" />
        <Skeleton {...args} className="h-4 w-[200px]" />
      </div>
    </div>
  ),
  args: {},
};
