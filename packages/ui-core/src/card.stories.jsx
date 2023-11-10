import {Button} from './button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './card';

const meta = {
  title: 'Card',
  component: Card,
  tags: ['autodocs'],
  argTypes: {},
  parameters: {
    layout: 'centered',
  },
};

export default meta;

export const Base = {
  render: (args) => (
    <Card {...args} className="w-[480px]">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
      </CardHeader>
      <CardContent>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
        voluptatibus, voluptatem, quibusdam, quod voluptas dolorum quia
        accusantium voluptatum quae doloribus aperiam? Quae, voluptatibus
      </CardContent>
      <CardFooter>
        <Button>Mark all as read</Button>
      </CardFooter>
    </Card>
  ),
  args: {},
};
