import { GetStaticPropsResult } from "next";
import { GetStaticPathsResult, GetStaticPropsContext } from "next/types";
import { useMemo } from "react";
import { BlogPost } from "../../components";
import { parseBlogPost } from "../../helpers";
import { getBlog } from "../../lib";

export type PostProps = {
  serializedBlogPost: string;
  serializedNextBlogPost: string | null;
  serializedPreviousBlogPost: string | null;
};

export default function Post({ serializedBlogPost, serializedNextBlogPost, serializedPreviousBlogPost }: PostProps) {
  const post = useMemo<BlogPost>(() => parseBlogPost(serializedBlogPost), [serializedBlogPost]);
  const previousPost = useMemo<BlogPost | null>(
    () => (serializedPreviousBlogPost === null ? null : parseBlogPost(serializedPreviousBlogPost)),
    [serializedPreviousBlogPost],
  );
  const nextPost = useMemo<BlogPost | null>(
    () => (serializedNextBlogPost === null ? null : parseBlogPost(serializedNextBlogPost)),
    [serializedNextBlogPost],
  );

  return (
    <BlogPost nextPost={nextPost} post={post} previousPost={previousPost} />
  );
}

export type BlogPostStaticParams = {
  month: string;
  slug: string;
  year: string;
};

export function getStaticPaths(): GetStaticPathsResult<BlogPostStaticParams> {
  const blog = getBlog();

  return {
    fallback: false,
    paths: blog.posts.map((p) => ({
      params: {
        month: p.date.format("MM"),
        slug: p.slug,
        year: p.date.format("YYYY"),
      },
    })),
  };
}

export function getStaticProps(context: GetStaticPropsContext<BlogPostStaticParams>): GetStaticPropsResult<PostProps> {
  const { params } = context;
  const blog = getBlog();

  if (params === undefined) {
    throw new Error("An error has occurred on getStaticProps.");
  }

  const index = blog.posts.findIndex((p) => p.href === `/blog/${params.slug}`);

  return {
    props: {
      serializedBlogPost: JSON.stringify(blog.posts[index]),
      serializedNextBlogPost: index === 0 ? null : JSON.stringify(blog.posts[index - 1]),
      serializedPreviousBlogPost: index + 1 >= blog.posts.length ? null : JSON.stringify(blog.posts[index + 1]),
    },
  };
}
