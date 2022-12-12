import Head from "next/head";
import React, { useMemo } from "react";

type TitleKind = "blog" | "default" | "docs";

export type TitleProps = {
  children?: string;
  kind?: TitleKind;
  prefix?: boolean;
};

const kindTitles: Record<TitleKind, string> = {
  blog: "PoeticMetric Blog",
  default: "PoeticMetric",
  docs: "PoeticMetric Docs",
};

export function Title({ children, kind = "default", prefix = false }: TitleProps) {
  const title = useMemo<string>(() => {
    const kindTitle = kindTitles[kind];

    if (children === undefined) {
      return kindTitle;
    }

    return prefix ? `${kindTitle} | ${children}` : `${children} | ${kindTitle}`;
  }, [children, kind, prefix]);

  return (
    <Head>
      <title>{title}</title>
    </Head>
  );
}
