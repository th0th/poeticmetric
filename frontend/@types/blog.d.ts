type BlogPost = {
  author: string | null;
  content: string;
  date: import("dayjs").Dayjs;
  excerpt: string;
  href: string;
  image: string;
  markdownFile: string;
  publicPath: string;
  slug: string;
  title: string;
};

type ParsedBlogPost = Overwrite<BlogPost, {
  date: string;
}>;
