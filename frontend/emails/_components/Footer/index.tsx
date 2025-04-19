import { Section } from "@react-email/components";
import { CSSProperties } from "react";
import Text from "../Text";

const styles: Record<string, CSSProperties> = {
  section: {
    borderStyle: "solid",
    borderTopColor: "#DFDFDF",
    borderTopWidth: 1,
    marginTop: 8,
    paddingTop: 8,
  },
  text: {
    fontSize: 12,
    marginTop: 0,
    textAlign: "center",
  },
};

export default function Footer() {
  return (
    <Section style={styles.section}>
      <Text style={styles.text}>Copyright &copy; PoeticMetric</Text>
    </Section>
  );
}
