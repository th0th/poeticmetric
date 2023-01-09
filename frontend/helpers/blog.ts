import dayjs from "dayjs";

export function hydrateBlogPost(parsedBlogPost: ParsedBlogPost): BlogPost {
  return {
    ...parsedBlogPost,
    date: dayjs(parsedBlogPost.date),
  };
}

export function parseBlogPost(serializerBlogPost: string): BlogPost {
  const parsedBlogPost: ParsedBlogPost = JSON.parse(serializerBlogPost);

  return hydrateBlogPost(parsedBlogPost);
}

export function parseBlogPosts(serializedBlogPosts: string): Array<BlogPost> {
  const parsedBlogPosts: Array<ParsedBlogPost> = JSON.parse(serializedBlogPosts);

  return parsedBlogPosts.map(hydrateBlogPost);
}
