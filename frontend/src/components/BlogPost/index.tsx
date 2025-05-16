import { IconArrowBigDownLinesFilled } from "@tabler/icons-react";
import { Link, useParams } from "react-router";
import CanonicalLink from "~/components/CanonicalLink";
import Description from "~/components/Description";
import Markdown from "~/components/Markdown";
import NotFound from "~/components/NotFound";
import OpenGraphImage from "~/components/OpenGraphImage";
import Title from "~/components/Title";
import { getBlogPosts } from "~/lib/blog";

const blogPosts = getBlogPosts();

export default function BlogPost() {
  const { blogPostSlug } = useParams();
  const blogPostIndex = blogPosts.findIndex((p) => p.slug === blogPostSlug);
  const blogPost = blogPosts[blogPostIndex];
  const nextBlogPost = blogPosts[blogPostIndex - 1];
  const previousBlogPost = blogPosts[blogPostIndex + 1];

  return blogPost === undefined ? (
    <NotFound />
  ) : (
    <>
      <Title template="blog">{blogPost.metaTitle || blogPost.title}</Title>

      {blogPost.description !== undefined ? (
        <Description>{blogPost.description}</Description>
      ) : null}

      <CanonicalLink path={`/blog/${blogPost.slug}`} />

      <OpenGraphImage image={{ height: 1792, url: blogPost.coverUrl, width: 1024 }} />

      <div className="bg-body">
        <div
          className="align-items-center bg-attachment-fixed bg-position-center bg-size-cover d-flex flex-column justify-content-center
           min-h-vh-100-header position-relative py-4 text-light"
          style={{ backgroundImage: `url(${blogPost.coverUrl})` }}
        >
          <img alt={blogPost.title} className="visually-hidden" src={blogPost.coverUrl} />

          <div className="position-absolute bg-black bg-opacity-75 start-0 end-0 top-0 bottom-0 z-2" />

          <div className="container position-relative text-center z-2">
            <h1 className="display-5 fw-bold">{blogPost.title}</h1>

            <div className="fs-5 fw-medium opacity-75">{blogPost.date.format("MMMM D, YYYY")}</div>

            <a
              className="align-items-center btn btn-primary d-flex flex-column justify-content-center mt-6 mx-auto rounded-circle size-4rem"
              href="#article"
            >
              <IconArrowBigDownLinesFilled size={36} />
            </a>
          </div>
        </div>

        <article className="container mw-50rem py-32" id="article">
          <Markdown className="fs-5 lh-lg" path={blogPost.path} type="blogPost">{blogPost.content}</Markdown>
        </article>

        <div className="border-top py-4">
          <div className="container">
            <div className="align-items-center row">
              <div className="col col-5">
                {previousBlogPost !== undefined && (
                  <>
                    <div className="fs-7 fw-medium text-body-secondary">&larr; Previous post</div>

                    <Link className="d-block fw-bold text-decoration-none" to={`/blog/${previousBlogPost.slug}`}>
                      {previousBlogPost.title}
                    </Link>
                  </>
                )}
              </div>

              <div className="col col-2" />

              <div className="col col-5 text-end">
                {nextBlogPost !== undefined && (
                  <>
                    <div className="fs-7 fw-medium text-body-secondary">Next post &rarr;</div>

                    <Link className="d-block fw-bold text-decoration-none" to={`/blog/${nextBlogPost.slug}`}>
                      {nextBlogPost.title}
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export const Component = BlogPost;
