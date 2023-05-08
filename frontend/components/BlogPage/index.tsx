import classNames from "classnames";
import { range } from "lodash";
import Link from "next/link";
import React, { useMemo } from "react";
import { Col, Container, Pagination, Row } from "react-bootstrap";
import { CanonicalLink } from "../CanonicalLink";
import { Description } from "../Description";
import { Layout } from "../Layout";
import { Title } from "../Title";
import styles from "./BlogPage.module.scss";
import { MailListForm } from "./MailListForm";

type BlogPageProps = {
  currentPage: number;
  pageCount: number;
  posts: Array<BlogPost>;
};

export function BlogPage({ currentPage, pageCount, posts }: BlogPageProps) {
  const mailListFormNode = useMemo<React.ReactNode>(() => currentPage === 1 ? (
    <MailListForm className="mb-5" />
  ) : null, [currentPage]);

  const paginationNode = useMemo<React.ReactNode>(() => {
    if (pageCount < 2) {
      return null;
    }

    const items = range(1, pageCount + 1).map((p) => {
      const active = currentPage === p;

      return (
        <li className={classNames("page-item", active && "active")} key={p}>
          {active ? (
            <span className="page-link">{p}</span>
          ) : (
            <Link className="page-link" href={`/blog/page/${p}`}>{p}</Link>
          )}
        </li>
      );
    });

    return (
      <div className="align-items-center d-flex flex-column mt-5">
        <Pagination>
          {items}
        </Pagination>
      </div>
    );
  }, [currentPage, pageCount]);

  return (
    <Layout kind="website">
      <CanonicalLink path={currentPage === 1 ? "/blog" : `/blog/page/${currentPage}`} />

      <Title kind="blog">Privacy-focused website analytics tips and best practices</Title>

      <Description>
        Stay up to date on the latest privacy-first and regulation-compliant website analytics news, tips, and best practices with
        PoeticMetric&apos;s blog. Learn how to use data to improve your website and better understand your users, all while keeping their
        privacy and compliance top of mind.
      </Description>

      <div className="py-5">
        {mailListFormNode}

        <Container>
          <Row className="g-5" lg={2} xs={1}>
            {posts.map((p) => (
              <Col key={p.href}>
                <Link
                  className={`bg-cover bg-cover-blur d-block text-decoration-none ${styles.postLink}`}
                  href={p.href}
                  style={{ backgroundImage: `url("${p.image}")` }}
                >
                  <div
                    className={classNames(
                      "bg-dark bg-opacity-75 d-flex flex-column h-16rem justify-content-center px-3 text-center text-white",
                      styles.postLinkWrapper,
                    )}
                  >
                    <h6 className="fs-md-5 lh-base">{p.title}</h6>

                    <div className="fs-sm fw-semibold">
                      <span>{p.date.format("MMMM D, YYYY")}</span>

                      {p.author !== null ? (
                        <>
                          <span>, </span>

                          <span>{p.author}</span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </Col>
            ))}
          </Row>

          {paginationNode}
        </Container>
      </div>
    </Layout>
  );
}
