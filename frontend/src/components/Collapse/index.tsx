import clsx from "clsx";
import { JSX, PropsWithoutRef, useEffect, useRef, useState } from "react";
import styles from "./Collapse.module.css";

type CollapseProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["div"]>, {
  open: boolean;
}>;

export default function Collapse({ children, className, open, ...props }: CollapseProps) {
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current && open) {
      setContentHeight(contentRef.current["scrollHeight"]);
    } else {
      setContentHeight(0);
    }
  }, [open]);

  return (
    <div {...props} className={clsx(styles.collapse, className)} style={{ height: contentHeight }}>
      <div ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
