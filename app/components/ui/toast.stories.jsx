import {Button} from './button';
import {toast, Toaster} from './toast';

const meta = {
  title: 'Toast',
  component: Toaster,
  tags: ['autodocs'],
  argTypes: {},
};
export default meta;

export const Simple = {
  render: () => (
    <div className="space-x-2">
      <Button
        variant="outline"
        onClick={() => {
          toast('Message sent');
        }}
      >
        Simple case
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.message('Message sent', {
            description: 'Your message has been sent successfully.',
          });
        }}
      >
        With Description
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.message('Message sent', {
            description: 'Your message has been sent successfully.',
            action: {
              label: 'Undo',
              onClick: () => console.log('Undo'),
            },
          });
        }}
      >
        With Action
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.success('Message sent');
        }}
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.info('Message sent');
        }}
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.error('Message sent');
        }}
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          toast.warning('Message sent');
        }}
      >
        Warning
      </Button>
      <Toaster richColors position="top-right" />
    </div>
  ),
};
