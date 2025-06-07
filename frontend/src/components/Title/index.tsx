import { JSX, PropsWithoutRef, useMemo } from "react";

export type TitleProps = {
  children: PropsWithoutRef<JSX.IntrinsicElements["title"]>["children"];
  template?: "blog" | "default" | "docs" | "none";
};

export default function Title({ children, template = "default" }: TitleProps) {
  const title = useMemo(() => {
    return ({
      blog: `${children} | PoeticMetric blog`,
      default: `${children} | PoeticMetric`,
      docs: `${children} | PoeticMetric docs`,
      none: `${children}`,
    })[template];
  }, [children, template]);

  return (
    <>
      <title>{title}</title>
      <meta content={title} property="og:title" />
    </>
  );
}
