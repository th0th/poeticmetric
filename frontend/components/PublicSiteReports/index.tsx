import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Container } from "react-bootstrap";
import { usePublicSite } from "../../hooks";
import { Layout } from "../Layout";
import { Title } from "../Title";

export function PublicSiteReports() {
  const router = useRouter();

  const domain = useMemo<string | undefined>(() => {
    if (!router.isReady || router.query.d === undefined || typeof router.query.d !== "string") {
      return undefined;
    }

    return router.query.d;
  }, [router.isReady, router.query.d]);

  const { data: site } = usePublicSite(domain);

  return (
    <Layout kind="website">
      <Title>{site === undefined ? "..." : `Reports - ${site.name}`}</Title>

      <Container>

      </Container>
    </Layout>
  );
}
