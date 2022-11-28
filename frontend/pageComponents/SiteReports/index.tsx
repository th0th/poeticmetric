import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useEffect } from "react";
import { Breadcrumb, Col, Container, Row, Spinner } from "react-bootstrap";
import {
  Layout,
  SiteGeoReport,
  SiteOverviewReport,
  SitePageReport,
  SitePageViewsAndVisitorsReport,
  SiteReportsFiltersHandler,
  SiteReportsTimeWindowInput,
} from "../../components";
import { ToastsContext } from "../../contexts";
import { useQueryNumber, useSite } from "../../hooks";

export function SiteReports() {
  const router = useRouter();
  const id = useQueryNumber("id");
  const { data: site, error } = useSite(id);
  const { addToast } = useContext(ToastsContext);

  useEffect(() => {
    if (id === undefined || error !== undefined) {
      if (error !== undefined) {
        addToast({ body: error.message, variant: "danger" });
      }

      router.replace("/sites");
    }
  }, [addToast, error, id, router]);

  return (
    <Layout>
      <Container className="d-flex flex-column flex-grow-1 py-4">
        {site === undefined ? (
          <div className="d-flex flex-grow-1 align-items-center justify-content-center">
            <Spinner />
          </div>
        ) : (
          <SiteReportsFiltersHandler>
            <Breadcrumb>
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>

              <li className="breadcrumb-item">
                <Link href="/sites">Sites</Link>
              </li>
            </Breadcrumb>

            <h1 className="fw-bold">test</h1>

            <SiteReportsTimeWindowInput />

            <SiteOverviewReport className="mt-3" />

            <Row className="g-3 mt-0">
              <Col lg={8}>
                <SitePageViewsAndVisitorsReport />
              </Col>

              <Col lg={4}>
                <SitePageReport className="h-100" />
              </Col>
            </Row>

            <Row className="mt-3">
              <Col lg={4}>
              </Col>

              <Col lg={8}>
                <SiteGeoReport />
              </Col>
            </Row>
          </SiteReportsFiltersHandler>
        )}
      </Container>
    </Layout>
  );
}
