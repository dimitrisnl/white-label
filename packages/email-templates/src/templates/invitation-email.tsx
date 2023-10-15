import {Template} from '../common.js';
import zod from 'zod';

export const InvitationEmailName = 'InvitationEmail';

export const validation = zod.object({
  invitationDeclineUrl: zod.string().url(),
  dashboardUrl: zod.string().url(),
  orgName: zod.string(),
});

export type Props = zod.infer<typeof validation>;

export const InvitationEmailTemplate = ({
  orgName,
  invitationDeclineUrl,
  dashboardUrl,
}: Props) => (
  <Template.Html>
    <Template.Head />
    <Template.Preview>You've been invited to join {orgName}</Template.Preview>
    <Template.Body>
      <Template.Container>
        <Template.Section>
          <Template.Text>You've been invited to join {orgName}</Template.Text>
          <Template.Button href={dashboardUrl}>Join the team</Template.Button>
          <Template.Hr />
          <Template.Link href={invitationDeclineUrl}>
            Decline this invitation
          </Template.Link>
        </Template.Section>
        <Template.Footer />
      </Template.Container>
    </Template.Body>
  </Template.Html>
);

InvitationEmailTemplate.PreviewProps = {
  orgName: 'Acme Co',
  invitationDeclineUrl: 'https://example.com',
  dashboardUrl: 'https://example.com',
} as Props;

export default InvitationEmailTemplate;
