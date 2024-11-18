import clsx from "clsx";
import { CSSProperties, PropsWithoutRef, JSX, ReactNode } from "react";
import styles from "./Marquee.module.css";

export type MarqueeProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["div"]>, {
  items: ReactNode[];
}>

export default function Marquee({ className, items, ...props }: MarqueeProps) {
  const style = { "--number-of-items": items.length } as CSSProperties;

  return (
    <div
      {...props}
      className={clsx(styles.marquee, className)}
      style={style}
    >
      {items.map((content) => (
        <div className={styles.item} key={`marquee-item-${JSON.stringify(content)}`}>
          {content}
        </div>
      ))}
    </div>
  );
}
