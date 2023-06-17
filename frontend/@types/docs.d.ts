type DocsArticle = {
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

type DocsItems = Array<DocsCategory>;
