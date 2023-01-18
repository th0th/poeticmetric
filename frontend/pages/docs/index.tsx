import { GetStaticPropsResult } from "next";
import { useMemo } from "react";
import { DocsArticle } from "../../components";
import { getDocs } from "../../lib";

export type DocsProps = {
  serializedCategories: string;
};

export default function Docs({ serializedCategories }: DocsProps) {
  const categories = useMemo<Array<DocsCategory>>(() => JSON.parse(serializedCategories), [serializedCategories]);

  return (
    <DocsArticle
      article={categories[0].articles[0]}
      categories={categories}
    />
  );
}

export function getStaticProps(): GetStaticPropsResult<DocsProps> {
  return {
    props: {
      serializedCategories: JSON.stringify(getDocs()),
    },
  };
}
