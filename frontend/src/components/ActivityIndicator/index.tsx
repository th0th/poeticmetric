import classNames from "classnames";
import { JSX, PropsWithoutRef } from "react";
import styles from "./ActivityIndicator.module.scss";

export type ActivityIndicatorProps = Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

export default function ActivityIndicator({ className, ...props }: ActivityIndicatorProps) {
  return (
    <div {...props} className={classNames(styles.activityIndicator, className)}>
      <div className={styles.line} />
      <div className={styles.line} />
      <div className={styles.line} />
    </div>
  );
}
