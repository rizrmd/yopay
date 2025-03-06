const KIRIM_EMAIL_API_KEY =
  "8d65f2eb4f10312be1d51cc4e46abbc2746cb2b5ddb5c2452c357dd1afa480b2";
const KIRIM_EMAIL_API_URL =
  "https://aplikasi.kirim.email/api/v3/transactional/messages";
const from = "info@esensi.online";
const domain = "esensi.online";
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
import { render } from "@react-email/render";
import { Link } from "lucide-react";
import { isValidElement, ReactElement } from "react";

export const sendEmail = async (arg: {
  to: string;
  subject: string;
  body: string | ReactElement;
  code?: string;
  footer?: string;
}) => {
  try {
    const formData = new FormData();
    formData.append("from", from); // Replace with your email
    formData.append("to", arg.to);
    formData.append("subject", arg.subject);
    formData.append(
      "html",
      await render(
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
      )
    );

    const response = await fetch(KIRIM_EMAIL_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(
          `api:${KIRIM_EMAIL_API_KEY}`
        ).toString("base64")}`,
        domain, // Replace with your actual domain
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(
        `Email sending failed: ${response.status} ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error: any) {
    console.error("Failed to send email:", error);
    return error?.message;
  }
};

const footerLogos = {
  marginBottom: "32px",
  paddingLeft: "8px",
  paddingRight: "8px",
  display: "block",
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
