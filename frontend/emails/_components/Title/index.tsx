import { CSSProperties } from "react";
import Text, { TextProps } from "~emails/_components/Text";

export type TitleProps = TextProps;

const styles: Record<string, CSSProperties> = {
  title: {
    fontSize: 30,
    fontWeight: 700,
  },
};

export default function Title({ style, ...props }: TitleProps) {
  return (
    <Text {...props} style={{ ...styles.title, ...style }} />
  );
}
