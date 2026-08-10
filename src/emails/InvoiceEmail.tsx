import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface InvoiceEmailProps {
  invoiceNumber: string;
  totalAmount: number;
  companyName: string;
}

export const InvoiceEmail = ({
  invoiceNumber = "INV-2026-000",
  totalAmount = 0,
  companyName = "Klient",
}: InvoiceEmailProps) => {
  const formatCZK = (val: number) => {
    return new Intl.NumberFormat("cs-CZ", {
      style: "currency",
      currency: "CZK",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Html>
      <Head />
      <Preview>Nová faktura {invoiceNumber} od Victory Webs</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Victory Webs</Heading>
          
          <Section style={section}>
            <Text style={text}>Dobrý den, zástupci společnosti {companyName},</Text>
            <Text style={text}>
              do přílohy tohoto e-mailu jsme vám zaslali novou fakturu <strong>{invoiceNumber}</strong> za naše služby.
            </Text>
            
            <div style={highlightBox}>
              <Text style={highlightText}>
                Celková částka k úhradě: <strong>{formatCZK(totalAmount)}</strong>
              </Text>
            </div>

            <Text style={text}>
              Fakturu si můžete kdykoliv stáhnout také ve svém Klientském portálu.
              V případě jakýchkoliv dotazů mě neváhejte kontaktovat.
            </Text>
          </Section>

          <Text style={footer}>
            S pozdravem,<br />
            <strong>Adrian Köteles</strong><br />
            Majitel, Victory Webs
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default InvoiceEmail;

const main = {
  backgroundColor: "#F5F5F7",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  padding: "40px 0",
};

const container = {
  margin: "0 auto",
  padding: "40px",
  backgroundColor: "#ffffff",
  borderRadius: "16px",
  border: "1px solid rgba(0,0,0,0.06)",
  boxShadow: "0 8px 30px rgba(0,0,0,0.04)",
  maxWidth: "600px",
};

const h1 = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0 0 24px",
  padding: "0",
};

const section = {
  marginBottom: "32px",
};

const text = {
  color: "#374151",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "0 0 16px",
};

const highlightBox = {
  backgroundColor: "#F7F9FC",
  borderRadius: "12px",
  padding: "24px",
  marginTop: "24px",
  marginBottom: "24px",
  border: "1px solid rgba(0,0,0,0.04)",
  textAlign: "center" as const,
};

const highlightText = {
  color: "#111827",
  fontSize: "18px",
  margin: "0",
};

const footer = {
  color: "#6B7280",
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0",
  paddingTop: "24px",
  borderTop: "1px solid #F3F4F6",
};
