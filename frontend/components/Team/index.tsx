import Link from "next/link";
import React, { useContext, useMemo } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { Layout, Title } from "..";
import { AuthAndApiContext } from "../../contexts";
import { useUsers } from "../../hooks";
import { DeleteModal } from "./DeleteModal";
import { User } from "./User";

export function Team() {
  const { organization } = useContext(AuthAndApiContext);
  const { data: users } = useUsers();

  const usersNode = useMemo(() => {
    if (users === undefined) {
      return (
        <Spinner animation="border" />
      );
    }

    return (
      <Row className="g-4" lg={3} md={2} xs={1} xxl={4}>
        {users.map((u) => (
          <Col key={u.id}>
            <User user={u} />
          </Col>
        ))}
      </Row>
    );
  }, [users]);

  return (
    <Layout kind="app">
      <Title>Team</Title>

      <Container className="py-5">
        <div className="align-items-md-center d-flex flex-column flex-sm-row gap-3 justify-content-between mb-3">
          <h1 className="mb-0 text-center">{`${organization?.name} team`}</h1>

          <Link className="btn btn-primary" href="/team/invite">Invite new team member</Link>
        </div>

        {usersNode}
      </Container>

      <DeleteModal />
    </Layout>
  );
}
