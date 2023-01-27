import { useMemo } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { Layout, Title } from "..";
import { useSites } from "../../hooks";
import { DeleteModal } from "./DeleteModal";
import { Header } from "./Header";
import { Site } from "./Site";

export function Sites() {
  const { data: sites } = useSites();

  const contentNode = useMemo(() => {
    if (sites === undefined) {
      return (
        <Spinner className="m-auto" variant="primary" />
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

      <Container className="d-flex flex-column flex-grow-1 py-5">
        <Header />

        {contentNode}
      </Container>

      <DeleteModal />
    </Layout>
  );
}
