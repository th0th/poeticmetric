import { CSSProperties, PropsWithoutRef, JSX, ReactNode } from "react";

type CardProps = PropsWithoutRef<JSX.IntrinsicElements["div"]> & {
  body: ReactNode;
  footer?: ReactNode;
  header: ReactNode;
};

const styles: Record<string, CSSProperties> = {
  card: {
    backgroundClip: "border-box",
    border: "1px solid rgba(0, 0, 0, .125)",
    borderRadius: 4,
    minWidth: 0,
    wordWrap: "break-word",
  },
  cardBody: {
    padding: 20,
  },
  cardFooter: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderTopColor: "rgba(0, 0, 0, .125)",
    borderTopStyle: "solid",
    borderTopWidth: 1,
    padding: "12px 20px",
  },
  cardHeader: {
    backgroundColor: "rgba(0, 0, 0, .03)",
    borderBottom: "1px solid rgba(0, 0, 0, .125)",
    padding: "12px 20px",
  },
  cardTitle: {
    fontSize: 20,
    paddingBottom: 12,
  },
};

export default function Card({ body, footer, header, style, ...props }: CardProps) {
  return (
    <div {...props} style={{ ...styles.card, ...style }}>
      <div style={styles.cardHeader}>
        {header}
      </div>

      <div style={styles.cardBody}>
        {body}
      </div>

      {footer && (
        <div style={styles.cardFooter}>
          {footer}
        </div>
      )}
    </div>
  );
}
