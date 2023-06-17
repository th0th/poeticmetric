import classNames from "classnames";
import styles from "./MarkdownWrapper.module.scss";

export type MarkdownWrapperProps = React.PropsWithoutRef<JSX.IntrinsicElements["div"]>;

export default function MarkdownWrapper({ className, ...props }: MarkdownWrapperProps) {
  return (
    <div {...props} className={classNames(styles.markdownWrapper, className)} />
  );
}
