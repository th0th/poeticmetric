import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { Layout, Title } from "..";
import { useUsers } from "../../hooks";
import { DeletionModal } from "./DeletionModal";
import { Header } from "./Header";
import { OrganizationOwnershipTransferModal } from "./OrganizationOwnershipTransferModal";
import { User } from "./User";

export function Team() {
  const router = useRouter();
  const { data: users } = useUsers();

  const filteredUsers = useMemo<Array<User> | null>(() => {
    if (users === undefined) {
      return null;
    }

    return users.filter((user) => {
      if ((router.query.status === "active" && !user.isActive) || (router.query.status === "pending" && user.isActive)) {
        return false;
      }

      return true;
    });
  }, [router.query, users]);

  const usersNode = useMemo(() => {
    if (filteredUsers === null) {
      return (
        <div className="align-items-center d-flex flex-column flex-grow-1 justify-content-center p-3">
          <Spinner className="align-self-center" variant="primary" />
        </div>
      );
    }

    return (
      <Row className="g-4" lg={3} md={2} xs={1} xxl={4}>
        {filteredUsers.map((u) => (
          <Col key={u.id}>
            <User user={u} />
          </Col>
        ))}
      </Row>
    );
  }, [filteredUsers]);

  return (
    <Layout kind="app">
      <Title>Team</Title>

      <Container className="d-flex flex-column flex-grow-1 py-5">
        <Header />

        {usersNode}
      </Container>

      <DeletionModal />
      <OrganizationOwnershipTransferModal />
    </Layout>
  );
}
