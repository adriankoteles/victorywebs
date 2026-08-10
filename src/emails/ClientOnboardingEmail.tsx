import * as React from "react";
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ClientOnboardingEmailProps {
  companyName: string;
  systemId: string;
  pinCode: string;
  portalUrl?: string;
}

export const ClientOnboardingEmail = ({
  companyName = "Vážená kliente",
  systemId = "VW-001",
  pinCode = "123456",
  portalUrl = "https://yourdomain.com/portal",
}: ClientOnboardingEmailProps) => {
  const fullPortalUrl = `${portalUrl}?id=${systemId}`;

  return (
    <Html lang="cs">
      <Head />
      <Preview>Vítejte ve Victory Webs Agency OS - Váš klientský portál je připraven</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header Logo */}
          <Section style={headerSection}>
            <Text style={logoText}>Victory Webs</Text>
          </Section>

          {/* Body Content */}
          <Section style={contentSection}>
            <Heading style={heading}>Vítejte v týmu, {companyName}!</Heading>
            <Text style={paragraph}>
              Váš klientský portál ve Victory Webs Agency OS je připraven. Níže naleznete Vaše unikátní přístupové údaje pro vstup a dokončení onboardingu.
            </Text>

            {/* Credentials Box */}
            <Section style={credentialsCard}>
              <Text style={credentialsLabel}>PŘIHLAŠOVACÍ ÚDAJE</Text>
              
              <div style={credentialRow}>
                <Text style={credentialKey}>Systémové ID:</Text>
                <Text style={credentialValue}>{systemId}</Text>
              </div>

              <div style={credentialRow}>
                <Text style={credentialKey}>PIN Kód:</Text>
                <Text style={credentialValuePin}>{pinCode}</Text>
              </div>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Button style={button} href={fullPortalUrl}>
                Vstoupit do Klientského Portálu
              </Button>
            </Section>

            <Text style={footerNote}>
              Pokud máte jakékoliv dotazy, jednoduše odpovězte na tento e-mail.
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Victory Webs. Všechna práva vyhrazena.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ClientOnboardingEmail;

// Soft Premium SaaS Styling for Emails
const main = {
  backgroundColor: "#F7F9FC",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "40px 20px",
  maxWidth: "560px",
};

const headerSection = {
  marginBottom: "24px",
  textAlign: "center" as const,
};

const logoText = {
  fontSize: "20px",
  fontWeight: "700",
  color: "#111827",
  letterSpacing: "-0.5px",
  margin: "0",
};

const contentSection = {
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  padding: "36px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
  border: "1px solid rgba(243,244,246,0.8)",
};

const heading = {
  fontSize: "22px",
  fontWeight: "600",
  color: "#111827",
  margin: "0 0 16px 0",
  letterSpacing: "-0.3px",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#4B5563",
  margin: "0 0 24px 0",
};

const credentialsCard = {
  backgroundColor: "#F7F9FC",
  borderRadius: "12px",
  padding: "20px",
  border: "1px solid #F3F4F6",
  margin: "0 0 28px 0",
};

const credentialsLabel = {
  fontSize: "10px",
  fontWeight: "700",
  color: "#9CA3AF",
  letterSpacing: "1.5px",
  margin: "0 0 12px 0",
};

const credentialRow = {
  marginBottom: "8px",
};

const credentialKey = {
  fontSize: "13px",
  color: "#6B7280",
  margin: "0",
  display: "inline-block",
  width: "110px",
};

const credentialValue = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#111827",
  margin: "0",
  display: "inline-block",
};

const credentialValuePin = {
  fontSize: "16px",
  fontWeight: "700",
  color: "#111827",
  letterSpacing: "2px",
  margin: "0",
  display: "inline-block",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "0 0 28px 0",
};

const button = {
  backgroundColor: "#111827",
  borderRadius: "9999px",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "500",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 28px",
};

const footerNote = {
  fontSize: "12px",
  color: "#9CA3AF",
  textAlign: "center" as const,
  margin: "0",
};

const footer = {
  marginTop: "24px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "12px",
  color: "#9CA3AF",
  margin: "0",
};
