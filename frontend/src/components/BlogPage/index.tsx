import classNames from "classnames";
import { range } from "lodash-es";
import { useMemo } from "react";
import { Link, useParams } from "react-router";
import CanonicalLink from "~/components/CanonicalLink";
import Description from "~/components/Description";
import NotFound from "~/components/NotFound";
import Title from "~/components/Title";
import { getBlogPosts } from "~/lib/blog";

const postCount = 10;

const blogPosts = getBlogPosts();

export default function BlogPage() {
  const { blogPage } = useParams();

  const pages = useMemo(() => range(1, Math.ceil(blogPosts.length / postCount) + 1), []);

  const page = useMemo<number | null>(() => {
    const p = blogPage === undefined ? 1 : Number(blogPage);

    if (Number.isNaN(p)) {
      return null;
    }

    return p;
  }, [blogPage]);

  const posts = useMemo(() => {
    if (page === null) {
      return null;
    }

    const p = blogPosts.slice((page - 1) * postCount, page * postCount);

    return p.length === 0 ? null : p;
  }, [page]);

  return posts !== null ? (
    <>
      <Title>Blog</Title>
      <Description>
        On PoeticMetric Blog, you can find about product news and updates. We also share tips and tricks that are helpful better uptime and
        availability.
      </Description>
      <CanonicalLink path={page === 1 ? "/blog" : `/blog/page/${page}`} />

      <div className="container py-28">
        <div className="gy-10 row row-cols-1 row-cols-md-2">
          {posts.map((post) => (
            <article className="col" key={post.slug}>
              <Link
                className="bg-body-hover d-block fw-bold h-100 p-12 rounded-3 scale-xs-hover shadow-lg-hover text-decoration-none
                transition-all"
                to={`/blog/${post.slug}`}
              >
                <img alt={post.title} className="aspect-ratio-5-3 d-block object-fit-cover w-100" loading="lazy" src={post.coverUrl} />

                <div className="fs-7 mt-4 text-body-secondary">{post.date.format("MMMM D, YYYY")}</div>

                <div className="fs-4 mt-4 text-body">{post.title}</div>
              </Link>
            </article>
          ))}
        </div>

        {pages.length > 1 ? (
          <nav className="align-items-center d-flex flex-column mt-24">
            <ul className="pagination">
              {pages.map((d) => (
                <li className={classNames("page-item", { active: d === page })} key={d}>
                  {d === page ? (
                    <span className="page-link">{d}</span>
                  ) : (
                    <Link className="page-link" to={d === 1 ? "/blog" : `/blog/page/${d}`}>{d}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </>
  ) : (
    <NotFound />
  );
}

export const Component = BlogPage;
