type DocsArticle = {
  category: Omit<DocsCategory, "articles">;
  content: string;
  excerpt: string;
  slug: string;
  title: string;
};

type DocsCacheItem = {
  category: string;
  content: string;
  href: string;
  title: string;
};

type DocsCategory = {
  articles: Array<DocsArticle>;
  slug: string;
  title: string;
};
