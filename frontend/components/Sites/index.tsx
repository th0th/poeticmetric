import Link from "next/link";
import React, { useMemo } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { Breadcrumb, Layout, Title } from "..";
import { useSites } from "../../hooks";
import { DeleteModal } from "./DeleteModal";
import { Site } from "./Site";

export function Sites() {
  const { data: sites } = useSites();

  const contentNode = useMemo(() => {
    if (sites === undefined) {
      return (
        <Spinner animation="border" />
      );
    }

    return (
      <Row md={2} xl={3} xs={1}>
        {sites.map((s) => (
          <Col className="pb-4" key={s.id}>
            <Site className="" site={s} />
          </Col>
        ))}
      </Row>
    );
  }, [sites]);

  return (
    <Layout kind="app">
      <Title>Sites</Title>

      <Container className="py-4">
        <div className="d-flex flex-row align-items-center justify-content-between">
          <Breadcrumb title="Sites" />

          <Link className="btn btn-primary" href="/sites/add">Add new site</Link>
        </div>

        <div className="mt-4">
          {contentNode}
        </div>
      </Container>

      <DeleteModal />
    </Layout>
  );
}
