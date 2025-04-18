import { Section, SectionProps } from "@react-email/components";
import { CSSProperties } from "react";
import Text from "../Text";

export type NotificationSummaryProps = SectionProps & {
  items: Array<{ title: string; value: string }>;
};

const styles: Record<string, CSSProperties> = {
  item: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 8,
  },
  legend: {
    fontWeight: 700,
  },
  summary: {
    backgroundColor: "#f4f4f4",
    borderTopColor: "#ececec",
    borderTopStyle: "solid",
    borderTopWidth: 5,
    marginTop: 32,
    paddingBottom: 8,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 8,
  },
  value: {
    marginLeft: 4,
  },
};

export default function NotificationSummary({ items, style, ...props }: NotificationSummaryProps) {
  return (
    <Section {...props} style={{ ...styles.summary, ...style }}>
      {items.map((item) => (
        <Text key={item.title} style={styles.item}>
          <span style={styles.legend}>{`${item.title}:`}</span>
          <span style={styles.value}>{item.value}</span>
        </Text>
      ))}
    </Section>
  );
}
