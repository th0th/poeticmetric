import { GetStaticPropsResult } from "next";
import React, { useMemo } from "react";
import { BlogPage } from "../../components";
import { parseBlogPosts } from "../../helpers";
import { getBlog } from "../../lib";

type PageProps = {
  currentPage: number;
  pageCount: number;
  serializedBlogPosts: string;
};

export default function Page({ currentPage, pageCount, serializedBlogPosts }: PageProps) {
  const posts = useMemo<Array<BlogPost>>(() => parseBlogPosts(serializedBlogPosts), [serializedBlogPosts]);

  return (
    <BlogPage currentPage={currentPage} pageCount={pageCount} posts={posts} />
  );
}

export function getStaticProps(): GetStaticPropsResult<PageProps> {
  const blog = getBlog();

  return {
    props: {
      currentPage: 1,
      pageCount: blog.pageCount,
      serializedBlogPosts: JSON.stringify(blog.posts.slice(0, blog.pageSize)),
    },
  };
}
