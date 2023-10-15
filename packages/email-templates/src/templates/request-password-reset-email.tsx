import {Template} from '../common.js';
import zod from 'zod';

export const RequestPasswordResetEmailName = 'RequestPasswordResetEmail';

export const validation = zod.object({
  requestPasswordResetUrl: zod.string().url(),
  email: zod.string().email(),
});

export type Props = zod.infer<typeof validation>;

export const RequestPasswordResetEmailTemplate = ({
  requestPasswordResetUrl,
  email,
}: Props) => (
  <Template.Html>
    <Template.Head />
    <Template.Preview>Password reset for {email}</Template.Preview>
    <Template.Body>
      <Template.Container>
        <Template.Section>
          <Template.Text>Click here to reset your password</Template.Text>
          <Template.Button href={requestPasswordResetUrl}>
            Reset Password
          </Template.Button>
        </Template.Section>
        <Template.Footer />
      </Template.Container>
    </Template.Body>
  </Template.Html>
);

RequestPasswordResetEmailTemplate.PreviewProps = {
  email: 'example@example.com',
  requestPasswordResetUrl: 'https://example.com',
} as Props;

export default RequestPasswordResetEmailTemplate;
