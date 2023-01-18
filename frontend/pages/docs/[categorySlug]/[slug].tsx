import { GetStaticPaths, GetStaticPropsResult } from "next";
import { GetStaticPropsContext } from "next/types";
import { useMemo } from "react";
import { DocsArticle } from "../../../components";
import { getDocs } from "../../../lib";

export type ArticleProps = {
  serializedArticle: string;
  serializedCategories: string;
};

export default function Article({ serializedArticle, serializedCategories }: ArticleProps) {
  const article = useMemo<DocsArticle>(() => JSON.parse(serializedArticle), [serializedArticle]);
  const categories = useMemo<Array<DocsCategory>>(() => JSON.parse(serializedCategories), [serializedCategories]);

  return (
    <DocsArticle
      article={article}
      categories={categories}
    />
  );
}

type GetStaticPathsContext = {
  categorySlug: string;
  slug: string;
};

export const getStaticPaths: GetStaticPaths<GetStaticPathsContext> = async () => {
  return {
    fallback: false,
    paths: getDocs().map((category) => category.articles.map((article) => ({
      params: {
        categorySlug: category.slug,
        slug: article.slug,
      },
    }))).flat(),
  };
};

export function getStaticProps(context: GetStaticPropsContext<GetStaticPathsContext>): GetStaticPropsResult<ArticleProps> {
  const { params } = context;

  if (params === undefined) {
    throw new Error("An error occurred on getStaticProps.");
  }

  return {
    props: {
      serializedArticle: JSON.stringify(
        getDocs().find((category) => category.slug === params.categorySlug)?.articles.find((article) => article.slug === params.slug),
      ),
      serializedCategories: JSON.stringify(getDocs()),
    },
  };
}
