import clsx from "clsx";
import { JSX, PropsWithoutRef } from "react";
import styles from "./Layout.module.css";

type LayoutProps = PropsWithoutRef<JSX.IntrinsicElements["main"]>

export default function Layout({ children, className, ...props }: LayoutProps) {
  return (
    <main {...props} className={clsx(styles.layout, className)}>
      {children}
    </main>
  );
}
