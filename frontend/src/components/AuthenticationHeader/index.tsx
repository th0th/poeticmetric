import clsx from "clsx";
import { PropsWithoutRef, ReactNode, JSX } from "react";
import styles from "./AuthenticationHeader.module.css";

type AuthenticationHeaderProps = Overwrite<Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  actions?: ReactNode,
  description: ReactNode,
  summary: ReactNode,
  title: ReactNode
}>

export default function AuthenticationHeader({ actions, className, description, summary, title, ...props }: AuthenticationHeaderProps) {
  return (
    <div {...props} className={clsx(styles.authenticationHeader, className)}>
      <p className={styles.summary}>{summary}</p>

      <h1 className={styles.heading}>
        {title}
      </h1>

      <p>
        {description}
      </p>

      {actions ? (
        <div className={styles.actionGroup}>
          {actions}
        </div>
      ) : null}
    </div>
  );
}
