import Link from "next/link";
import React from "react";
import { Breadcrumb, Col, Container, Row } from "react-bootstrap";
import {
  Layout,
  SiteOverviewReport,
  SitePageReport,
  SitePageViewsAndVisitorsReport,
  SiteReportsFiltersHandler,
  SiteReportsTimeWindowInput,
} from "../../components";
import styles from "./SiteReports.module.scss";

export function SiteReports() {
  return (
    <SiteReportsFiltersHandler>
      <Layout>
        <Container className="py-4">
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
            <Col className={styles.sitePageViewsAndVisitorsReportCol} lg={8} xs={12}>
              <SitePageViewsAndVisitorsReport />
            </Col>

            <Col lg={4} xs={12}>
              <SitePageReport className="h-100" />
            </Col>
          </Row>
        </Container>
      </Layout>
    </SiteReportsFiltersHandler>
  );
}
