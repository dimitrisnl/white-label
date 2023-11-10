import {Button} from './button';

export default {
  title: 'Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Primary = {
  args: {
    variant: 'default',
    children: 'Button',
  },
};

export const Secondary = {
  args: {
    variant: 'secondary',
    children: 'Button',
  },
};

export const Destructive = {
  args: {
    variant: 'destructive',
    children: 'Button',
  },
};

export const Outline = {
  args: {
    variant: 'outline',
    children: 'Button',
  },
};

export const Ghost = {
  args: {
    variant: 'ghost',
    children: 'Button',
  },
};

export const Link = {
  args: {
    variant: 'link',
    children: 'Button',
  },
};

export const Large = {
  args: {
    size: 'lg',
    children: 'Button',
  },
};

export const Small = {
  args: {
    size: 'sm',
    children: 'Button',
  },
};

export const Icon = {
  args: {
    size: 'icon',
    children: 'B',
  },
};
