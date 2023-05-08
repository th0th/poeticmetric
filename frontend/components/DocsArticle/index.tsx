import { useRouter } from "next/router";
import React from "react";
import { Breadcrumb, CanonicalLink, Description, Layout, Markdown, Title } from "..";
import { Menu } from "./Menu";

type DocsArticleProps = {
  article: DocsArticle;
  categories: Array<DocsCategory>;
};

export function DocsArticle({ article, categories }: DocsArticleProps) {
  const router = useRouter();

  return (
    <Layout kind="website">
      <CanonicalLink
        path={router.asPath === "/docs"
          ? `/docs/${categories[0].slug}/${categories[0].articles[0].slug}`
          : `/docs/${article.category.slug}/${article.slug}`}
      />

      <Title kind="docs">{`${article.category.title} - ${article.title}`}</Title>

      <Description>{article.excerpt}</Description>

      <div className="bg-white d-flex flex-column flex-grow-1 flex-md-row">
        <Menu article={article} categories={categories} />

        <div className="border-start-md min-w-0 mw-50rem p-5 pt-4 pt-md-5">
          <Breadcrumb items={[{ href: "/docs", title: "Docs" }, { title: article.category.title }]} title={article.title} />

          <Markdown showTableOfContents>{article.content}</Markdown>
        </div>
      </div>
    </Layout>
  );
}
