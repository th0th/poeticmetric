import clsx from "clsx";
import { JSX, PropsWithoutRef } from "react";
import styles from "./ActivityOverlay.module.css";

type ActivityOverlayProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["div"]>, {
  isActive: boolean;
}>

export default function ActivityOverlay({ children, className, isActive, ...props }: ActivityOverlayProps) {
  return (
    <div {...props} className={clsx(styles.activityOverlay, isActive && styles.active, className)}>
      <div className={styles.overlay}></div>

      <div className={clsx("spinner", styles.spinner)}></div>

      {children}
    </div>
  );
}
