type DocsArticle = Overwrite<Markdown, {
  icon: string;
  slug: string;
  title: string;
}>;

type DocsCache = Array<DocsCacheItem>;

type DocsCacheItem = {
  article: DocsArticle;
  category: DocsCategory;
};

type DocsCategory = {
  slug: string;
  title: string;
};

type DocsCategoryWithArticles = DocsCategory & {
  articles: Array<DocsArticle>;
};
