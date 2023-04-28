import { range } from "lodash";
import { GetStaticPropsResult } from "next";
import { GetStaticPathsResult, GetStaticPropsContext } from "next/types";
import React, { useMemo } from "react";
import { BlogPage } from "../../../components";
import { parseBlogPosts } from "../../../helpers";
import { getBlog } from "../../../lib";

type PageProps = {
  currentPage: number;
  pageCount: number;
  serializedBlogPosts: string;
};

export default function Page({ currentPage, pageCount, serializedBlogPosts }: PageProps) {
  const blogPosts = useMemo<Array<BlogPost>>(() => parseBlogPosts(serializedBlogPosts), [serializedBlogPosts]);

  return (
    <BlogPage currentPage={currentPage} pageCount={pageCount} posts={blogPosts} />
  );
}

export function getStaticPaths(): GetStaticPathsResult<{ page: string }> {
  const blog = getBlog();

  return {
    fallback: false,
    paths: range(1, blog.pageCount + 1).map((page) => ({ params: { page: page.toString() } })),
  };
}

export function getStaticProps(context: GetStaticPropsContext): GetStaticPropsResult<PageProps> {
  const blog = getBlog();

  if (context.params === undefined) {
    throw new Error("An error has occurred on getStaticProps.");
  }

  const currentPage = Number(context.params.page);

  return {
    props: {
      currentPage,
      pageCount: blog.pageCount,
      serializedBlogPosts: JSON.stringify(blog.posts.slice((currentPage - 1) * blog.pageSize, currentPage * blog.pageSize)),
    },
  };
}
