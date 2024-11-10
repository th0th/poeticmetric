import clsx from "clsx";
import { JSX, PropsWithoutRef } from "react";
import Header from "~/components/Header";
import type { HeaderProps } from "~/components/Header";
import styles from "./Layout.module.css";

type LayoutProps = Overwrite<PropsWithoutRef<JSX.IntrinsicElements["main"]>, {
  headerProps?: HeaderProps,
}>;

export default function Layout({ children, className, headerProps, ...props }: LayoutProps) {
  return (
    <>
      <Header {...headerProps} />

      <main {...props} className={clsx(styles.layout, className)}>
        {children}
      </main>
    </>
  );
}
