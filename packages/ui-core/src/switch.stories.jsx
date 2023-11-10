import {Label} from './label';
import {Switch} from './switch';

const meta = {
  title: 'Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};
export default meta;

export const Base = {
  render: (args) => (
    <div className="flex items-center space-x-2">
      <Switch {...args} id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
  args: {},
};
