import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useMemo } from "react";
import { Container } from "react-bootstrap";
import { AuthContext } from "../../contexts";
import { Layout } from "../Layout";
import { Title } from "../Title";

export type SubscriptionHandlerProps = {
  children: React.ReactNode;
};

const routerQueryBlock = "no-subscription";

export function SubscriptionHandler({ children }: SubscriptionHandlerProps) {
  const router = useRouter();
  const { organization } = useContext(AuthContext);

  const shouldBlock = useMemo<boolean>(
    () => organization !== null
      && organization.plan === null
      && !router.asPath.startsWith("/billing")
      && !router.asPath.startsWith("/settings"),
    [organization, router.asPath],
  );

  useEffect(() => {
    if (shouldBlock && router.query.block !== routerQueryBlock) {
      router.replace({ pathname: router.pathname, query: { ...router.query, block: routerQueryBlock } }, undefined, { scroll: false });
    }
  }, [router, shouldBlock]);

  return shouldBlock ? (
    <Layout kind="app">
      <Title>Subscription required</Title>

      <Container className="align-items-center d-flex flex-column flex-grow-1 justify-content-center py-5">
        <div className="text-center">
          <i className="bi bi-lock-fill bis-5rem text-primary" />

          <h3>You don&apos;t have an active subscription</h3>

          <div className="fs-5 fw-medium text-muted">Please subscribe to continue to use PoeticMetric.</div>

          <div className="mt-5">
            <Link className="btn btn-lg btn-primary" href="/billing">Go to billing</Link>
          </div>
        </div>
      </Container>
    </Layout>
  ) : (
    <>{children}</>
  );
}
