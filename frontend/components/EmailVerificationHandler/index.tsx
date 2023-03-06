import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo } from "react";
import { Container } from "react-bootstrap";
import { AuthContext } from "../../contexts";
import { Layout } from "../Layout";
import { Title } from "../Title";

export type EmailVerificationHandlerProps = {
  children: React.ReactNode;
};

const routerQueryBlock = "unverified-email";

export function EmailVerificationHandler({ children }: EmailVerificationHandlerProps) {
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const shouldBlock = useMemo<boolean>(
    () => user !== null
      && !user.isEmailVerified
      && !router.asPath.startsWith("/settings"),
    [router.asPath, user],
  );

  useEffect(() => {
    if (shouldBlock && router.query.block !== routerQueryBlock) {
      router.replace({ pathname: router.pathname, query: { ...router.query, block: routerQueryBlock } }, undefined, { scroll: false });
    }
  }, [router, shouldBlock]);

  return shouldBlock ? (
    <Layout kind="app">
      <Title>Please verify your e-mail address to continue</Title>

      <Container className="align-items-center d-flex flex-column flex-grow-1 justify-content-center py-5">
        <div className="text-center">
          <i className="bi bi-envelope-at bis-5rem text-primary" />

          <h3>Please verify your e-mail address</h3>

          <div className="fs-5 fw-medium text-muted">You need to verify your e-mail address to continue.</div>
        </div>
      </Container>
    </Layout>
  ) : (
    <>{children}</>
  );
}
