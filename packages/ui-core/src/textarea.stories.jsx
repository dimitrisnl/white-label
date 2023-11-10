import {Button} from './button';
import {Label} from './label';
import {Textarea} from './textarea';

const meta = {
  title: 'Textarea',
  component: Textarea,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};
export default meta;

export const Default = {
  render: (args) => <Textarea {...args} />,
  args: {
    placeholder: 'Type your message here.',
  },
};

export const Disabled = {
  render: (args) => <Textarea {...args} />,
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const WithLabel = {
  render: (args) => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message">Your message</Label>
      <Textarea {...args} id="message" />
    </div>
  ),
  args: {...Default.args},
};

export const WithText = {
  render: (args) => (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="message-2">Your Message</Label>
      <Textarea {...args} id="message-2" />
      <p className="text-sm text-slate-500">
        Your message will be copied to the support team.
      </p>
    </div>
  ),
  args: {...Default.args},
};

export const WithButton = {
  render: (args) => (
    <div className="grid w-full gap-2">
      <Textarea {...args} />
      <Button>Send message</Button>
    </div>
  ),
  args: {...Default.args},
};
