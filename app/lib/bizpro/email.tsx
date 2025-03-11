import { ReactElement } from "react";

import { render } from "@react-email/render";
import { isValidElement } from "react";
import {
  Body,
  Column,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Row,
  Text,
  Hr,
} from "@react-email/components";

export const sendEmail = async (arg: {
  to: string;
  subject: string;
  body: string | ReactElement;
  code?: string;
  footer?: string;
}) => {
  try {
    const htmlBody = await render(
      <Html>
        <Head />
        <Body style={main}>
          <Preview>{arg.subject}</Preview>
          <Container style={container}>
            <Section style={logoContainer}>
              <Img
                src={`https://esensi.online/logo.webp`}
                width="50"
                height="50"
                alt="Esensi Online"
              />
            </Section>

            {isValidElement(arg.body) ? (
              arg.body
            ) : (
              <>
                <Heading style={h1}>{arg.subject}</Heading>
                <Text style={heroText}>{arg.body}</Text>
              </>
            )}

            {arg.code && (
              <Section style={codeBox}>
                <Text style={confirmationCodeText}>{arg.code}</Text>
              </Section>
            )}

            {arg.footer && <Text style={text}>{arg.footer}</Text>}

            <Hr className="border-t border-gray-300" />
            <Section>
              <Row>
                <Column style={{ width: "50px" }}>
                  <Img
                    src={`https://esensi.online/logo.webp`}
                    width="40"
                    height="40"
                    alt="Esensi Online"
                  />
                </Column>
                <Column>
                  <Text className="m-0">
                    Esensi Online
                    <br />
                    PT. Meraih Ilmu Semesta
                  </Text>
                </Column>
              </Row>
            </Section>
          </Container>
        </Body>
      </Html>,
      { pretty: true }
    );
 
    if (typeof window === "undefined") {
      const nodemailer = (await import("nodemailer")).default;
      const dotenv = (await import("dotenv")).default;

      // Initialize dotenv
      dotenv.config({
        path: "/app/prasi/data/code/bf706e40-2a3a-4148-9cdd-75d4483328d7/site/src/.env",
      });

      // Create a transporter using SMTP
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Send mail with defined transport object
      const info = await transporter.sendMail({
        from: process.env.SMTP_FROM || "info@esensi.online",
        to: arg.to,
        subject: arg.subject,
        html: htmlBody,
      });

      return { info };
    }
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return error?.message;
  }
};

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "0px 20px",
};

const logoContainer = {
  marginTop: "32px",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "36px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px",
};

const codeBox = {
  background: "rgb(245, 244, 245)",
  borderRadius: "4px",
  marginBottom: "30px",
  padding: "40px 10px",
};

const confirmationCodeText = {
  fontSize: "30px",
  textAlign: "center" as const,
  verticalAlign: "middle",
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
};
