import { Body, Container, Head, Html, Preview, Section } from "@react-email/components";
import { CSSProperties } from "react";
import Button from "./_components/Button";
import Fonts from "./_components/Fonts";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Text from "./_components/Text";
import Title from "./_components/Title";
import { commonStyles } from "./common-styles";

const styles: Record<string, CSSProperties> = {
  container: {
    paddingBottom: 24,
    paddingTop: 24,
  },
};

export default function Invitation() {
  return (
    <Html lang="en">
      <Head>
        <Fonts />
      </Head>

      <Preview>{`You are invited to join {{ .User.Organization.Name }} on PoeticMetric`}</Preview>

      <Body>
        <Container style={styles.container}>
          <Header />

          <Section>
            <Title></Title>

            <Text>{`You are invited to join {{ .User.Organization.Name }} on PoeticMetric`}</Text>

            <Button
              href={"{{ frontendUrl `/activation?t=` .User.ActivationToken }}"}
            >
              Activate my account
            </Button>

            <Text>
              If you have any questions, you can reply to this e-mail or write to
              {" "}
              <a href="mailto:support@poeticmetric.com" style={commonStyles.link}>support@poeticmetric.com</a>
              .
            </Text>
          </Section>

          <Footer />
        </Container>
      </Body>
    </Html>
  );
}
