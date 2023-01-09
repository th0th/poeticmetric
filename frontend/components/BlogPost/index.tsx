import Link from "next/link";
import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import { Description } from "../Description";
import { Layout } from "../Layout";
import { Markdown } from "../Markdown";
import { Title } from "../Title";

export type BlogPostProps = {
  nextPost: BlogPost | null;
  post: BlogPost;
  previousPost: BlogPost | null;
};

export function BlogPost({ nextPost, post, previousPost }: BlogPostProps) {
  const nextPostNode = useMemo<React.ReactNode>(() => {
    if (nextPost === null) {
      return null;
    }

    return (
      <Link className="d-block flex-shrink-1 fs-sm parent-text-decoration text-decoration-none text-end" href={nextPost.href}>
        <div className="fw-medium text-muted">Next post &rarr;</div>

        <div className="fw-bold parent-hover-text-decoration-underline">{nextPost.title}</div>
      </Link>
    );
  }, [nextPost]);

  const previousPostNode = useMemo<React.ReactNode>(() => {
    if (previousPost === null) {
      return null;
    }

    return (
      <Link className="d-block flex-shrink-1 fs-sm parent-text-decoration text-decoration-none" href={previousPost.href}>
        <div className="fw-medium text-muted">&larr; Previous post</div>

        <div className="fw-bold parent-hover-text-decoration-underline">{previousPost.title}</div>
      </Link>
    );
  }, [previousPost]);

  return (
    <Layout kind="website">
      <Title kind="blog">{post.title}</Title>
      <Description>{post.excerpt}</Description>

      <Container className="pt-4">
        <div className="mw-45rem mx-auto">
          <div className="fs-sm fw-bold text-muted">{post.date.format("MMMM D, YYYY")}</div>

          <h1 className="fw-bold">{post.title}</h1>

          <img alt={post.title} className="d-block mt-3 w-100" src={post.image} />

          <Markdown className="my-4">{post.content}</Markdown>
        </div>
      </Container>

      <div className="bg-white border-top py-2">
        <Container className="d-flex flex-row">
          {previousPostNode}

          <div className="flex-grow-1" />

          {nextPostNode}
        </Container>
      </div>
    </Layout>
  );
}
