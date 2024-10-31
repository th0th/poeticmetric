import { useMemo } from "react";
import { Helmet } from "react-helmet-async";

export type TitleProps = {
  children: string;
  template?: "default" | "docs" | "statusPage";
};

export default function Title({ children, template = "default" }: TitleProps) {
  const title = useMemo(() => {
    return ({
      default: `${children} | PoeticMetric`,
      docs: `${children} | PoeticMetric docs`,
      statusPage: `${children}`,
    })[template];
  }, [children, template]);

  return (
    <Helmet>
      <title>{title}</title>
      <meta content={title} property="og:title" />
    </Helmet>
  );
}
