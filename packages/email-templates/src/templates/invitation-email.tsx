import {Template} from '../common';

export const InvitationEmailName = 'InvitationEmail';

export type Props = {
  invitationDeclineUrl: string;
  dashboardUrl: string;
  orgName: string;
};

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
