import classNames from "classnames";
import hljs from "highlight.js";
import { JSX, PropsWithoutRef, useEffect, useRef } from "react";
import styles from "./Pre.module.scss";

export type PreProps = PropsWithoutRef<JSX.IntrinsicElements["pre"]>;

export default function Pre({ className, ...props }: PreProps) {
  const pre = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (pre.current !== null) {
      const code = pre.current.querySelector("code");
      if (code !== null && code.dataset.highlighted === undefined) {
        hljs.highlightElement(code);
      }
    }
  }, []);

  return (
    <pre {...props} className={classNames(styles.pre, className)} ref={pre} />
  );
}
