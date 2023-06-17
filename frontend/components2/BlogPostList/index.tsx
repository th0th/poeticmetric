import classNames from "classnames";
import Link from "next/link";
import React from "react";
import styles from "./BlogPostList.module.scss";

export type BlogPostListProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">, {
  posts: Array<BlogPost>;
}>;

export default function BlogPostList({ className, posts, ...props }: BlogPostListProps) {
  return (
    <div {...props} className={classNames("container", className)}>
      <div className="g-5 mb-5 row row-cols-1 row-cols-md-2">
        {posts.map((post) => (
          <div className="col" key={post.slug}>
            <Link
              className={classNames("bg-cover bg-cover-blur d-block text-decoration-none", styles.link)}
              href={`/blog/${post.slug}`}
              style={{ backgroundImage: `url("${post.image}")` }}
            >
              <div
                className={classNames(
                  "bg-dark bg-opacity-75 d-flex flex-column h-16rem justify-content-center px-3 text-center text-white",
                  styles.linkWrapper,
                )}
              >
                <h6 className="fs-md-5 lh-base">{post.title}</h6>

                <div className="fs-sm fw-semibold">
                  <span>{post.date.format("MMMM D, YYYY")}</span>

                  {post.author !== null ? (
                    <>
                      <span>, </span>

                      <span>{post.author}</span>
                    </>
                  ) : null}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
