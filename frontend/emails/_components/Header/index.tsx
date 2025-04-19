import { Img, Section } from "@react-email/components";
import { CSSProperties } from "react";

const styles: Record<string, CSSProperties> = {
  section: {
    paddingBottom: 16,
  },
};

export default function Header() {
  return (
    <Section style={styles.section}>
      <Img alt="PoeticMetric logo" src="https://poeticmetric-assets.s3.eu-west-1.amazonaws.com/emails/logo-poeticmetric-96.png" width={48} />
    </Section>
  );
}
