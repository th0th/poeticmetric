import { Text as BaseText, TextProps as BaseTextProps } from "@react-email/components";
import { CSSProperties } from "react";

export type TextProps = BaseTextProps;

const style: CSSProperties = {
  color: "#111215",
  fontSize: 16,
  lineHeight: 1.5,
};

export default function Text({ style: styleFromProps, ...props }: TextProps) {
  return (
    <BaseText {...props} style={{ ...style, ...styleFromProps }} />
  );
}
