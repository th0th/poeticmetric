import { Button as BaseButton, ButtonProps as BaseButtonProps } from "@react-email/components";

export type ButtonProps = BaseButtonProps;

const style = {
  backgroundColor: "#117BBF",
  borderRadius: 6,
  color: "#FFFFFF",
  fontSize: 16,
  fontWeight: 500,
  padding: "6px 12px",
};

export default function Button({ style: styleFromProps, ...props }: ButtonProps) {
  return (
    <BaseButton {...props} style={{ ...style, ...styleFromProps }} />
  );
}
