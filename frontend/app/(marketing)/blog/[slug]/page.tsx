import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import Markdown from "~components/Markdown";
import getNextPost from "~helpers/blog/getNextPost";
import getPost from "~helpers/blog/getPost";
import getPostSlugs from "~helpers/blog/getPostSlugs";
import getPreviousPost from "~helpers/blog/getPreviousPost";

type PageProps = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = getPost(params.slug);

  return {
    alternates: {
      canonical: `/blog/${params.slug}`,
    },
    description: post.excerpt,
    openGraph: {
      images: [post.image],
    },
    title: post.title,
    twitter: {
      images: [post.image],
    },
  };
}

export async function generateStaticParams(): Promise<Array<PageProps["params"]>> {
  return getPostSlugs().map((slug) => ({ slug }));
}

export default function Page({ params }: PageProps) {
  const post = getPost(params.slug);
  const previousPost = getPreviousPost(params.slug);
  const nextPost = getNextPost(params.slug);

  return (
    <>
      <div className="container pt-4">
        <div className="mw-45rem mx-auto">
          <div className="fs-sm fw-bold text-muted">{post.date.format("MMMM D, YYYY")}</div>

          <h1>{post.title}</h1>

          <img alt={post.title} className="d-block mt-3 w-100" src={post.image} />

          <Markdown className="my-4" source={post.content} />
        </div>
      </div>

      {previousPost !== null || nextPost !== null ? (
        <div className="bg-body border-top py-2">
          <div className="container d-flex flex-row">
            {previousPost !== null ? (
              <Link
                className="d-block flex-shrink-1 fs-sm parent-text-decoration text-decoration-none"
                href={`/blog/${previousPost.slug}`}
              >
                <div className="fw-medium text-muted">&larr; Previous post</div>

                <div className="fw-bold parent-hover-text-decoration-underline">{previousPost.title}</div>
              </Link>
            ) : null}

            <div className="flex-grow-1 px-1" />

            {nextPost !== null ? (
              <Link
                className="d-block flex-shrink-1 fs-sm parent-text-decoration text-decoration-none text-end"
                href={`/blog/${nextPost.slug}`}
              >
                <div className="fw-medium text-muted">Next post &rarr;</div>

                <div className="fw-bold parent-hover-text-decoration-underline">{nextPost.title}</div>
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
