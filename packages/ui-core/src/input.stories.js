import {Input} from './input';

export default {
  title: 'Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export const Default = {
  args: {
    disabled: false,
    placeholder: 'Enter some text',
  },
};

export const Disabled = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
  },
};
