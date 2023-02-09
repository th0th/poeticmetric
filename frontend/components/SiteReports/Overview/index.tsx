import classNames from "classnames";
import React from "react";
import { Card, CardProps, Col, Row, Spinner } from "react-bootstrap";
import { useSiteOverviewReport } from "../../../hooks";

export type SiteOverviewReportsProps = Omit<CardProps, "children">;

const changeIconClassNames: Record<SiteOverviewReportChangeVariant, string> = {
  danger: "bi bi-arrow-down-short",
  muted: "bi bi-arrow-right-short",
  success: "bi bi-arrow-up-short",
};

export function Overview({ ...props }: SiteOverviewReportsProps) {
  const { hydratedData: data } = useSiteOverviewReport();

  return (
    <Card {...props}>
      <Card.Body>
        {data === undefined ? (
          <Spinner variant="primary" />
        ) : (
          <Row lg={4} sm={2} xs={1}>
            <Col className="d-flex flex-column align-items-center align-items-sm-start text-center text-sm-start">
              <div className="fw-semibold mb-1">Page views</div>

              <div className="align-items-center d-flex flex-row">
                <div className="align-items-center bg-white border border-4 border-primary d-flex flex-column flex-grow-0 flex-shrink-0 h-2rem justify-content-center me-2 p-1 rounded-circle text-primary w-2rem">
                  <i className="bi bi-file-text-fill fs-sm" />
                </div>

                <span className="fs-5 fw-bold">{data.pageViewCountDisplay}</span>
              </div>

              <Card.Subtitle
                className={classNames(
                  "align-items-center d-flex flex-row fw-semibold mb-0 mt-2",
                  `text-${data.pageViewCountPercentageChangeVariant}`,
                )}
              >
                <i className={`${changeIconClassNames[data.pageViewCountPercentageChangeVariant]} fs-4`} />

                <span>{`${data.pageViewCountPercentageChange}%`}</span>
              </Card.Subtitle>
            </Col>

            <Col className="d-flex flex-column align-items-center align-items-sm-start mt-sm-0 mt-3 text-center text-sm-start">
              <div className="mb-1 fw-semibold">Visitors</div>

              <div className="d-flex flex-row align-items-center">
                <div className="align-items-center bg-white border border-4 border-primary d-flex flex-column flex-grow-0 flex-shrink-0 h-2rem justify-content-center me-2 p-1 rounded-circle text-primary w-2rem">
                  <i className="bi bi-person-fill fs-sm" />
                </div>

                <span className="fs-5 fw-bold">{data.visitorCountDisplay}</span>
              </div>

              <Card.Subtitle
                className={classNames(
                  "align-items-center d-flex flex-row fw-semibold mb-0 mt-2",
                  `text-${data.visitorCountPercentageChangeVariant}`,
                )}
              >
                <i className={`${changeIconClassNames[data.visitorCountPercentageChangeVariant]} fs-4`} />

                <span>{`${data.visitorCountPercentageChange}%`}</span>
              </Card.Subtitle>
            </Col>

            <Col className="d-flex flex-column align-items-center align-items-sm-start mt-lg-0 mt-3 text-center text-sm-start">
              <div className="mb-1 fw-semibold">Page views per visitor</div>

              <div className="d-flex flex-row align-items-center">
                <div className="align-items-center bg-white border border-4 border-primary d-flex flex-column flex-grow-0 flex-shrink-0 h-2rem justify-content-center me-2 p-1 rounded-circle text-primary w-2rem">
                  <i className="bi bi-layers-half fs-sm" />
                </div>

                <span className="fs-5 fw-bold">{data.pageViewCountPerVisitor}</span>
              </div>

              <Card.Subtitle
                className={classNames(
                  "align-items-center d-flex flex-row fw-semibold mb-0 mt-2",
                  `text-${data.pageViewCountPerVisitorPercentageChangeVariant}`,
                )}
              >
                <i className={`${changeIconClassNames[data.pageViewCountPerVisitorPercentageChangeVariant]} fs-4`} />

                <span>{`${data.pageViewCountPerVisitorPercentageChange}%`}</span>
              </Card.Subtitle>
            </Col>

            <Col className="d-flex flex-column align-items-center align-items-sm-start mt-lg-0 mt-3 text-center text-sm-start">
              <div className="mb-1 fw-semibold">Average page duration</div>

              <div className="d-flex flex-row align-items-center">
                <div className="align-items-center bg-white border border-4 border-primary d-flex flex-column flex-grow-0 flex-shrink-0 h-2rem justify-content-center me-2 p-1 rounded-circle text-primary w-2rem">
                  <i className="bi bi-clock-fill fs-sm" />
                </div>

                <span className="fs-5 fw-bold">{data.pageViewCountPerVisitor}</span>
              </div>

              <Card.Subtitle
                className={classNames(
                  "align-items-center d-flex flex-row fw-semibold mb-0 mt-2",
                  `text-${data.averagePageViewDurationPercentageChangeVariant}`,
                )}
              >
                <i className={`${changeIconClassNames[data.averagePageViewDurationPercentageChangeVariant]} fs-4`} />

                <span>{`${data.averagePageViewDurationPercentageChange}%`}</span>
              </Card.Subtitle>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}
