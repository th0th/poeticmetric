import React from "react";
import BlogTop from "../../../../components2/BlogTop";
import BlogPostList from "~components/BlogPostList";
import getPosts from "~helpers/blog/getPosts";

export default function Page() {
  const posts = getPosts(1);

  return (
    <>
      <BlogTop />

      <BlogPostList posts={posts} />
    </>
  );
}
