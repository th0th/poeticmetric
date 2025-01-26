import { createContext } from "react";

export type DocsArticleContextValue = {
  article: DocsArticle;
  category: DocsCategoryWithArticles;
};

export default createContext<DocsArticleContextValue>({
  article: {
    content: "",
    icon: "",
    path: "",
    slug: "",
    title: "",
    type: "docsArticle",
  },
  category: {
    articles: [],
    slug: "",
    title: "",
  },
});
