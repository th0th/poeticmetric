import React from "react";
import { Breadcrumb } from "../Breadcrumb";
import { Layout } from "../Layout";
import { Markdown } from "../Markdown";
import { Title } from "../Title";
import { Menu } from "./Menu";

type DocsArticleProps = {
  article: DocsArticle;
  categories: Array<DocsCategory>;
};

export function DocsArticle({ article, categories }: DocsArticleProps) {
  return (
    <Layout kind="website">
      <Title kind="docs">{article.title}</Title>

      <div className="d-flex flex-column flex-grow-1 flex-md-row">
        <Menu article={article} categories={categories} className="border-end-md" />

        <div className="mw-45rem p-5 pt-4 pt-md-5">
          <Breadcrumb items={[{ href: "/docs", title: "Docs" }]} title={article.title} />

          <Markdown>{article.content}</Markdown>
        </div>
      </div>
    </Layout>
  );
}
