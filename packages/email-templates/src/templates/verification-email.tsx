import zod from 'zod';
import {Template} from '../common.js';

export const VerificationEmailName = 'VerificationEmail';

export const validation = zod.object({
  verificationUrl: zod.string().url(),
});

export type Props = zod.infer<typeof validation>;

export const VerificationEmailTemplate = ({verificationUrl}: Props) => (
  <Template.Html>
    <Template.Head />
    <Template.Preview>
      Welcome to WhiteLabel! Please verify your email address.
    </Template.Preview>
    <Template.Body>
      <Template.Container>
        <Template.Section>
          <Template.Text>
            Welcome to WhiteLabel! Please verify your email address.
          </Template.Text>
          <Template.Button href={verificationUrl}>Verify Email</Template.Button>
        </Template.Section>
        <Template.Footer />
      </Template.Container>
    </Template.Body>
  </Template.Html>
);

VerificationEmailTemplate.PreviewProps = {
  verificationUrl: 'https://example.com',
} as Props;

export default VerificationEmailTemplate;
