type BlogPost = Overwrite<Markdown, {
  coverUrl: string;
  date: import("dayjs").Dayjs;
  description?: string;
  metaTitle?: string;
  slug: string;
  title: string;
}>;
