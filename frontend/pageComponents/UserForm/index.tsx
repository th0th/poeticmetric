import Link from "next/link";
import React, { useMemo } from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { Layout } from "../../components";
import { useQueryNumber } from "../../hooks";

export function UserForm() {
  const id = useQueryNumber("id");

  const title = useMemo(() => (id === undefined ? "Invite new team member" : "Edit team member"), [id]);

  return (
    <Layout kind="app">
      <Container className="py-4">
        <Breadcrumb>
          <li className="breadcrumb-item">
            <Link href="/">Home</Link>
          </li>

          <li className="breadcrumb-item">
            <Link href="/team">Team</Link>
          </li>
        </Breadcrumb>

        <h1 className="fw-bold">{title}</h1>
      </Container>
    </Layout>
  );
}
