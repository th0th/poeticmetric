import clsx from "clsx";
import { JSX, PropsWithoutRef, useEffect, useRef, useState } from "react";
import styles from "./Collapse.module.css";

type CollapseProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["div"]>, {
  open: boolean;
  resolution?: "lg";
}>;

export default function Collapse({ children, className, open, resolution = "lg", ...props }: CollapseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState<number>(0);

  useEffect(() => {
    if (contentRef.current && open) {
      setContentHeight(contentRef.current["scrollHeight"]);
    } else {
      setContentHeight(0);
    }
  }, [open]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty("--collapse-height", `${contentHeight}px`);
    }
  }, [contentHeight]);

  return (
    <div
      {...props}
      className={clsx(styles.collapse, styles[`collapse-${resolution}`], className)}
      ref={containerRef}
    >
      <div className={styles.content} ref={contentRef}>
        {children}
      </div>
    </div>
  );
}
