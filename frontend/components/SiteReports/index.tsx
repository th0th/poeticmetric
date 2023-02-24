import { omit } from "lodash";
import { useRouter } from "next/router";
import * as querystring from "querystring";
import React, { useMemo } from "react";
import { Col, Row, Stack } from "react-bootstrap";
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
  const router = useRouter();

  const exportQueryString = useMemo<string>(() => querystring.stringify({
    ...omit(router.query, ["id"]),
    siteId: router.query.id,
  }), [router.query]);

  return (
    <FiltersHandler siteId={site.id}>
      <div className="d-flex flex-row">
        <TimeWindowInput />

        <div className="flex-grow-1 w-auto pe-3" />

        <Stack direction="horizontal" gap={2}>
          <Filters />

          <a
            className="btn btn-primary"
            href={`${window.poeticMetric?.restApiBaseUrl}/site-reports/export?${exportQueryString}`}
          >
            Export reports
          </a>
        </Stack>
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
}
