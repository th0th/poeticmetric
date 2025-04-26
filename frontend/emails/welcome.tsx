import { Body, Container, Head, Html, Preview, Section } from "@react-email/components";
import { CSSProperties } from "react";
import Fonts from "./_components/Fonts";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Text from "./_components/Text";
import Title from "./_components/Title";

const styles: Record<string, CSSProperties> = {
  code: {
    fontFamily: `"Roboto Mono", monospace`,
    fontSize: 32,
  },
  container: {
    paddingBottom: 24,
    paddingTop: 24,
  },
};

export default function Welcome() {
  return (
    <Html lang="en">
      <Head>
        <Fonts />
      </Head>

      <Preview>Please verify your e-mail address.</Preview>

      <Body>
        <Container style={styles.container}>
          <Header />

          <Section>
            <Title>Welcome to PoeticMetric!</Title>

            <Text>Thank you for signing up with PoeticMetric!</Text>

            <Text>Here is your e-mail verification code:</Text>

            <Text style={styles.code}>
              {`{{ .User.EmailVerificationCode }} `}
            </Text>

            <Text>
              You can also click the link below to verify your e-mail address:
            </Text>

            <a href="{{ frontendUrl `/email-address-verification?c=` (toString .User.EmailVerificationCode) }}">
              {"{{ frontendUrl `/email-address-verification?c=` (toString .User.EmailVerificationCode) }}"}
            </a>
          </Section>

          <Footer />
        </Container>
      </Body>
    </Html>
  );
}
