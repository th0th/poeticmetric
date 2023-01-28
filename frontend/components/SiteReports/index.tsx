import React from "react";
import { Col, Row } from "react-bootstrap";
import { Filters } from "./Filters";
import { FiltersHandler } from "./FiltersHandler";
import { Geo } from "./Geo";
import { Overview } from "./Overview";
import { Path } from "./Path";
import { Referrer } from "./Referrer";
import { Tech } from "./Tech";
import { TimeTrends } from "./TimeTrends";
import { TimeWindowInput } from "./TimeWindowInput";
import { Utm } from "./Utm";
import { VisitorPageView } from "./VisitorPageView";

export type SiteReportsProps = {
  site: Site;
};

export function SiteReports({ site }: SiteReportsProps) {
  return (
    <FiltersHandler siteId={site.id}>
      <div className="d-flex flex-row">
        <TimeWindowInput />

        <div className="flex-grow-1 w-auto pe-3" />

        <Filters />
      </div>

      <Overview className="mt-3" />

      <Row className="g-3 mt-0">
        <Col lg={8}>
          <VisitorPageView />
        </Col>

        <Col lg={4}>
          <Path />
        </Col>
      </Row>

      <Row className="g-3 mt-0">
        <Col lg={4}>
          <Referrer />
        </Col>

        <Col lg={8}>
          <Geo />
        </Col>
      </Row>

      <Row className="g-3 mt-0">
        <Col lg={4}>
          <Tech />
        </Col>

        <Col lg={4}>
          <TimeTrends />
        </Col>

        <Col lg={4}>
          <Utm />
        </Col>
      </Row>
    </FiltersHandler>
  );

  // return (
  //   <Layout kind="app">
  //     <Title>{site === undefined ? "..." : `Reports - ${site.name}`}</Title>
  //
  //     <Container className="d-flex flex-column flex-grow-1 py-4">
  //       {site === undefined ? (
  //         <div className="d-flex flex-grow-1 align-items-center justify-content-center">
  //           <Spinner variant="primary" />
  //         </div>
  //       ) : (
  //
  //       )}
  //     </Container>
  //   </Layout>
  // );
}
