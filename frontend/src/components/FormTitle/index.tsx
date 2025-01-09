import classNames from "classnames";
import { PropsWithoutRef, ReactNode, JSX } from "react";
import styles from "./FormTitle.module.css";
import { IconChevronLeft } from "@tabler/icons-react";

export type FormTitleProps = Overwrite<Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  actions?: ReactNode;
  description: ReactNode;
  maxWidth?: "fit-content" | "28rem";
  showGoBack?: boolean;
  summary: ReactNode;
  title: ReactNode;
}>;

export default function FormTitle(
  {
    actions,
    className,
    description,
    maxWidth = "fit-content",
    showGoBack = true,
    summary,
    title,
    ...props
  }: FormTitleProps) {
  return (
    <div
      {...props}
      className={classNames(styles.formTitle, className)}
      style={{ maxWidth }}
    >
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

      {showGoBack ? (
        <button
          aria-label="Go back"
          className={classNames("button", "button-sm", styles.goBack)}
          onClick={() => history.back()}
        >
          <IconChevronLeft size="1rem" />

          Go back
        </button>
      ) : null}
    </div>
  );
}
