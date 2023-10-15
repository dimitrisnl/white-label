import {Template} from '../common.js';
import zod from 'zod';

export const PasswordResetEmailName = 'PasswordResetEmail';

export const validation = zod.object({
  passwordResetUrl: zod.string().url(),
  dashboardUrl: zod.string().url(),
});

export type Props = zod.infer<typeof validation>;

export const PasswordResetEmailTemplate = ({
  passwordResetUrl,
}: Props) => (
  <Template.Html>
    <Template.Head />
    <Template.Preview>Password reset</Template.Preview>
    <Template.Body>
      <Template.Container>
        <Template.Section>
          <Template.Text>Click here to reset your password</Template.Text>
          <Template.Button href={passwordResetUrl}>
            Reset Password
          </Template.Button>
        </Template.Section>
        <Template.Footer />
      </Template.Container>
    </Template.Body>
  </Template.Html>
);

PasswordResetEmailTemplate.PreviewProps = {
  passwordResetUrl: 'https://example.com',
} as Props;

export default PasswordResetEmailTemplate;
