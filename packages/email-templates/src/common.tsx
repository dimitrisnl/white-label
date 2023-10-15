import {
  Body as JsxBody,
  BodyProps,
  Button as JsxButton,
  ButtonProps,
  Container as JsxContainer,
  ContainerProps,
  Head as JsxHead,
  HeadProps,
  Hr as JsxHr,
  HrProps,
  Html as JsxHtml,
  HtmlProps,
  Preview as JsxPreview,
  PreviewProps,
  Section as JsxSection,
  SectionProps,
  Text as JsxText,
  TextProps,
  Link as JsxLink,
  LinkProps,
} from '@jsx-email/all';

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

function Body(props: BodyProps) {
  return <JsxBody {...props} style={main} />;
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  marginBottom: '64px',
  padding: '20px 0 48px',
};

function Container(props: ContainerProps) {
  return <JsxContainer {...props} style={container} />;
}

const section = {
  padding: '0 48px',
};

function Section(props: SectionProps) {
  return <JsxSection {...props} style={section} />;
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

function Hr(props: HrProps) {
  return <JsxHr {...props} style={hr} />;
}

const paragraph = {
  color: '#777',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

function Text(props: TextProps) {
  return <JsxText {...props} style={paragraph} />;
}

const anchor = {
  color: 'blue',
};

function Link(props: LinkProps) {
  return <JsxLink {...props} style={anchor} />;
}

const button = {
  backgroundColor: 'blue',
  borderRadius: '5px',
  color: '#fff',
  display: 'block',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  textDecoration: 'none',
  width: '100%',
  padding: '10px',
};

function Button(props: ButtonProps) {
  return <JsxButton {...props} style={button} />;
}

function Head(props: HeadProps) {
  return <JsxHead {...props} />;
}

function Html(props: HtmlProps) {
  return <JsxHtml {...props} />;
}

function Preview(props: PreviewProps) {
  return <JsxPreview {...props} />;
}

export const Footer = () => (
  <Template.Section>
    <Template.Hr />
    <Template.Text>White Label</Template.Text>
  </Template.Section>
);

export const Template = {
  Body,
  Container,
  Section,
  Hr,
  Text,
  Link,
  Button,
  Head,
  Html,
  Preview,
  Footer,
};
