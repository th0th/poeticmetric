import range from "lodash/range";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import BlogPostList from "~components/BlogPostList";
import getPosts from "~helpers/blog/getPosts";
import getPostSlugs from "~helpers/blog/getPostSlugs";

type PageProps = {
  params: {
    page: string;
  };
};

export function generateMetadata({ params }: PageProps): Metadata {
  return {
    alternates: {
      canonical: `/blog/page/${params.page}`,
    },
    description: "Stay up to date on the latest privacy-first and regulation-compliant website analytics news, tips, and best practices with PoeticMetric&apos;s blog. Learn how to use data to improve your website and better understand your users, all while keeping their privacy and compliance top of mind.",
    title: `Page ${params.page}`,
  };
}

export function generateStaticParams(): Array<PageProps["params"]> {
  const params: Array<PageProps["params"]> = [];

  const postCount = getPostSlugs().length;

  range(2, Math.ceil(postCount / 10)).forEach((page) => params.push({ page: page.toString() }));

  return params;
}

export default function Page({ params }: PageProps) {
  if (params.page === "1") {
    return redirect("/blog");
  }

  const page = Number(params.page);
  const posts = getPosts(page);

  return (
    <BlogPostList posts={posts} />
  );
}
