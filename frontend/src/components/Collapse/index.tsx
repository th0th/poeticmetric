import clsx from "clsx";
import { CSSProperties, JSX, PropsWithoutRef, useEffect, useRef, useState } from "react";
import styles from "./Collapse.module.css";

/* This value should match with transition duration value */
const TRANSITION_DURATION = 350;

type CollapseProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["div"]>, {
  open: boolean;
}>;

export default function Collapse({ children, className, open, ...props }: CollapseProps) {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState<number>(0);
  const [overflow, setOverflow] = useState<CSSProperties["overflow"]>("hidden");

  useEffect(() => {
    if (contentRef.current && open) {
      setContentHeight(contentRef.current["scrollHeight"]);
    } else {
      setContentHeight(0);
    }

    const timeout = setTimeout(() => {
      if (open) {
        setOverflow("visible");
      }
    }, TRANSITION_DURATION);

    return () => {
      clearTimeout(timeout);

      setOverflow("hidden");
    };
  }, [open]);

  return (
    <div {...props} className={clsx(styles.collapse, className)} style={{ height: contentHeight, overflow }}>
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
