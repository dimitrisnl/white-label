import type {
  BodyProps,
  ButtonProps,
  ContainerProps,
  HeadProps,
  HrProps,
  HtmlProps,
  LinkProps,
  PreviewProps,
  SectionProps,
  TextProps,
} from '@jsx-email/all';
import {
  Body as JsxBody,
  Button as JsxButton,
  Container as JsxContainer,
  Head as JsxHead,
  Hr as JsxHr,
  Html as JsxHtml,
  Link as JsxLink,
  Preview as JsxPreview,
  Section as JsxSection,
  Text as JsxText,
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
