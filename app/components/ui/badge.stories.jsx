import {Badge} from './badge';

const meta = {
  title: 'Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};
export default meta;

export const Base = {
  render: (args) => <Badge {...args}>Badge</Badge>,
  args: {},
};

export const Secondary = {
  render: (args) => <Badge {...args}>Badge</Badge>,
  args: {
    variant: 'secondary',
  },
};

export const Destructive = {
  render: (args) => <Badge {...args}>Badge</Badge>,
  args: {
    variant: 'destructive',
  },
};

export const Outline = {
  render: (args) => <Badge {...args}>Badge</Badge>,
  args: {
    variant: 'outline',
  },
};
