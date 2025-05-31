import { Body, Container, Head, Html, Preview, Section } from "@react-email/components";
import { CSSProperties } from "react";
import Fonts from "./_components/Fonts";
import Footer from "./_components/Footer";
import Header from "./_components/Header";
import Text from "./_components/Text";
import Title from "./_components/Title";
import { commonStyles } from "./common-styles";

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

      <Preview>
        Thank you for choosing PoeticMetric, We&apos;re honored to have you as our customer and we&apos;re committed to providing you with
        the best possible experience.
      </Preview>

      <Body>
        <Container style={styles.container}>
          <Header />

          <Section>
            <Title>Happy to have you with us!</Title>

            <Text>Greetings,</Text>

            <Text>
              <span style={commonStyles.textBold}>
                We wanted to personally thank you for choosing PoeticMetric as your website analytics solution.
              </span>

              {" "}
              We understand the importance of making informed decisions about your business and we are honored that you have placed your
              trust in us.
            </Text>

            <Text>
              <span style={commonStyles.textBold}>
                At PoeticMetric, we take data privacy very seriously and we are committed to providing a privacy-first approach to our
                customers.
              </span>

              {" "}
              We understand that your data is important to you and we will do everything in our power to ensure it is safe and secure.
            </Text>

            <Text>
              As a paid customer, you will have access to all of our features and benefits, and priority support. Our
              {" "}
              <a href="{{ frontendUrl `/docs` }}" style={commonStyles.link}>comprehensive documentation</a>
              {" "}
              will guide you through the process of setting up and using PoeticMetric, and our team is always available to help you with any
              questions or concerns.
            </Text>

            <Text>
              Once again, thank you for choosing PoeticMetric. We are confident that you will find our platform to be a valuable
              asset to your business.
            </Text>

            <Text>
              Cheers,
            </Text>
          </Section>

          <Footer />
        </Container>
      </Body>
    </Html>
  );
}
