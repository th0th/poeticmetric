import clsx from "clsx";
import { JSX, PropsWithoutRef } from "react";
import styles from "./Layout.module.css";

type LayoutProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["main"]>, {
  verticallyCenter?: boolean;
}>

export default function Layout({ children, className, verticallyCenter = false, ...props }: LayoutProps) {
  return (
    <main
      className={clsx(
        styles.layout,
        verticallyCenter && styles.verticallyCenter,
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
}
