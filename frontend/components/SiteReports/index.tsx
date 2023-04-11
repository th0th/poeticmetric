import { omit } from "lodash";
import { useRouter } from "next/router";
import * as querystring from "querystring";
import React, { useCallback, useMemo, useRef } from "react";
import { Col, Dropdown, Row, Stack } from "react-bootstrap";
import { getRestApiUrl, getUserAccessToken } from "../../helpers";
import { Filters } from "./Filters";
import { Geo } from "./Geo";
import { Handler } from "./Handler";
import { Overview } from "./Overview";
import { Path } from "./Path";
import { Source } from "./Source";
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
  const exportReportsForm = useRef<HTMLFormElement>(null);
  const exportEventsForm = useRef<HTMLFormElement>(null);

  const exportFormActionQueryString = useMemo<string>(() => querystring.stringify({
    ...omit(router.query, ["domain", "id"]),
    siteId: site.id,
  }), [router.query, site.id]);

  const submitExportEventsForm = useCallback(() => {
    const userAccessToken = getUserAccessToken();

    if (exportEventsForm.current !== null && userAccessToken !== null) {
      exportEventsForm.current.submit();
    }
  }, []);

  const submitExportReportsForm = useCallback(() => {
    const userAccessToken = getUserAccessToken();

    if (exportReportsForm.current !== null && userAccessToken !== null) {
      exportReportsForm.current.submit();
    }
  }, []);

  return (
    <Handler site={site}>
      <form
        action={getRestApiUrl(`/site-reports/export/reports?${exportFormActionQueryString}`)}
        className="d-none"
        encType="multipart/form-data"
        method="post"
        ref={exportReportsForm}
        target="_blank"
      >
        <input name="user-access-token" type="hidden" value={getUserAccessToken() || ""} />
      </form>

      <form
        action={getRestApiUrl(`/site-reports/export/events?${exportFormActionQueryString}`)}
        className="d-none"
        encType="multipart/form-data"
        method="post"
        ref={exportEventsForm}
        target="_blank"
      >
        <input name="user-access-token" type="hidden" value={getUserAccessToken() || ""} />
      </form>

      <div className="d-flex flex-row">
        <TimeWindowInput />

        <div className="flex-grow-1 w-auto pe-3" />

        <Stack direction="horizontal" gap={2}>
          <Filters />

          <Dropdown>
            <Dropdown.Toggle variant="outline-primary">Export</Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as="button" onClick={submitExportReportsForm}>Reports</Dropdown.Item>

              <Dropdown.Item as="button" onClick={submitExportEventsForm}>Raw events</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
          <Source />
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
    </Handler>
  );
}
