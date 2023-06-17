type BlogPost = {
  author: string | null;
  content: string;
  date: import("dayjs").Dayjs;
  excerpt?: string;
  image: string;
  publicPath: string;
  slug: string;
  title: string;
};

type ParsedBlogPost = Overwrite<BlogPost, {
  date: string;
}>;
