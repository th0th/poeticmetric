import classNames from "classnames";
import { JSX, PropsWithoutRef } from "react";
import styles from "./Blockquote.module.scss";

export type BlockquoteProps = PropsWithoutRef<JSX.IntrinsicElements["blockquote"]>;

export default function Blockquote({ children, className, ...props }: BlockquoteProps) {
  return (
    <blockquote
      {...props}
      className={classNames(
        "font-serif fs-5 fst-italic fw-medium lh-base position-relative pe-8 ps-16 py-8",
        styles.blockquote,
        className,
      )}
    >
      <div className="fs-2 mt-3 position-absolute start-0 top-50 text-primary translate-middle">&ldquo;</div>

      {children}
    </blockquote>
  );
}
