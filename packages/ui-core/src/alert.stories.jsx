import {Alert, AlertDescription, AlertTitle} from './alert';

const meta = {
  title: 'Alert',
  component: Alert,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Base = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Lorem Ipsum</AlertTitle>
      <AlertDescription>Alert description</AlertDescription>
    </Alert>
  ),
  args: {
    variant: 'default',
  },
};

export const Success = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Lorem Ipsum</AlertTitle>
      <AlertDescription>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eligendi in
        consequuntur animi suscipit?
      </AlertDescription>
    </Alert>
  ),
  args: {
    variant: 'success',
  },
};

export const Destructive = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Lorem Ipsum</AlertTitle>
      <AlertDescription>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eligendi in
        consequuntur animi suscipit?
      </AlertDescription>
    </Alert>
  ),
  args: {
    variant: 'destructive',
  },
};
