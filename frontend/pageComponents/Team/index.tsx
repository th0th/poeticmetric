import Link from "next/link";
import React, { useContext, useMemo } from "react";
import { Breadcrumb, Container, Spinner } from "react-bootstrap";
import { Layout } from "../../components";
import { AuthAndApiContext } from "../../contexts";
import { useUsers } from "../../hooks";
import { User } from "./User";

export function Team() {
  const { organization } = useContext(AuthAndApiContext);
  const { data: users } = useUsers();

  const topNode = useMemo(() => (
    <div className="d-flex flex-row align-items-end justify-content-between">
      <div>
        <Breadcrumb>
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>
        </Breadcrumb>

        <h1 className="fw-bold">{`${organization?.name} team`}</h1>
      </div>

      <Link className="btn btn-primary" href="/team/invite">Invite new team member</Link>
    </div>
  ), [organization?.name]);

  const usersNode = useMemo(() => {
    if (users === undefined) {
      return (
        <Spinner animation="border" />
      );
    }

    return (
      <div className="d-grid mt-4">
        {users.map((u) => (
          <User className="col-12 col-md-6 col-lg-4 col-xl-3" key={u.id} user={u} />
        ))}
      </div>
    );
  }, [users]);

  return (
    <Layout>
      <Container className="py-4">
        {topNode}

        {usersNode}
      </Container>
    </Layout>
  );
}
