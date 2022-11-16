import IconArrowDownShort from "bootstrap-icons/icons/arrow-down-short.svg";
import IconArrowRightShort from "bootstrap-icons/icons/arrow-right-short.svg";
import IconArrowUpShort from "bootstrap-icons/icons/arrow-up-short.svg";
import IconClockFill from "bootstrap-icons/icons/clock-fill.svg";
import IconFileTextFill from "bootstrap-icons/icons/file-text-fill.svg";
import IconLayersHalf from "bootstrap-icons/icons/layers-half.svg";
import IconPersonFill from "bootstrap-icons/icons/person-fill.svg";
import classNames from "classnames";
import React from "react";
import { Card, CardProps, Col, Row, Spinner } from "react-bootstrap";
import { useSiteOverviewReport } from "../../hooks";
import styles from "./SiteOverviewReport.module.scss";

export type SiteOverviewReportsProps = Omit<CardProps, "children">;

const changeIcons: Record<SiteOverviewReportChangeVariant, any> = {
  danger: IconArrowDownShort,
  muted: IconArrowRightShort,
  success: IconArrowUpShort,
};

export function SiteOverviewReport({ ...props }: SiteOverviewReportsProps) {
  const { hydratedData: data } = useSiteOverviewReport();

  return (
    <Card {...props}>
      <Card.Body>
        {data === undefined ? (
          <Spinner animation="border" />
        ) : (
          <Row lg={4} sm={2} xs={1}>
            <Col className="d-flex flex-column align-items-center align-items-sm-start text-center text-sm-start">
              <div className="fw-semibold mb-1">Page views</div>

              <div className="align-items-center d-flex flex-row">
                <div className={classNames("flex-grow-0 flex-shrink-0 d-flex flex-column align-items-center justify-content-center bg-white rounded-circle text-primary border-3 border-primary border me-2 p-1", styles.iconWrapper)}>
                  <IconFileTextFill className="d-block" />
                </div>

                <span className="fs-5 fw-bold">{data.pageViewCount}</span>
              </div>

              <Card.Subtitle className={classNames("d-flex flex-row align-items-center mt-2 fw-semibold", `text-${data.pageViewCountPercentageChangeVariant}`)}>
                {React.createElement(changeIcons[data.pageViewCountPercentageChangeVariant], {
                  className: classNames("d-block flex-grow-0 flex-shrink-0", styles.changeIndicator),
                })}

                <span>{`${data.pageViewCountPercentageChange}%`}</span>
              </Card.Subtitle>
            </Col>

            <Col className="d-flex flex-column align-items-center align-items-sm-start mt-sm-0 mt-3 text-center text-sm-start">
              <div className="mb-1 fw-semibold">Visitors</div>

              <div className="d-flex flex-row align-items-center">
                <div className={classNames("flex-grow-0 flex-shrink-0 d-flex flex-column align-items-center justify-content-center bg-white rounded-circle text-primary border-3 border-primary border me-2 p-1", styles.iconWrapper)}>
                  <IconPersonFill className="d-block" />
                </div>

                <span className="fs-5 fw-bold">{data.visitorCount}</span>
              </div>

              <Card.Subtitle className={classNames("d-flex flex-row align-items-center mt-2 fw-semibold", `text-${data.visitorCountPercentageChangeVariant}`)}>
                {React.createElement(changeIcons[data.visitorCountPercentageChangeVariant], {
                  className: classNames("d-block flex-grow-0 flex-shrink-0", styles.changeIndicator),
                })}

                <span>{`${data.visitorCountPercentageChange}%`}</span>
              </Card.Subtitle>
            </Col>

            <Col className="d-flex flex-column align-items-center align-items-sm-start mt-lg-0 mt-3 text-center text-sm-start">
              <div className="mb-1 fw-semibold">Page views per visitor</div>

              <div className="d-flex flex-row align-items-center">
                <div className={classNames("flex-grow-0 flex-shrink-0 d-flex flex-column align-items-center justify-content-center bg-white rounded-circle text-primary border-3 border-primary border me-2 p-1", styles.iconWrapper)}>
                  <IconLayersHalf className="d-block" />
                </div>

                <span className="fs-5 fw-bold">{data.pageViewCountPerVisitor}</span>
              </div>

              <Card.Subtitle className={classNames("d-flex flex-row align-items-center mt-2 fw-semibold", `text-${data.pageViewCountPercentageChangeVariant}`)}>
                {React.createElement(changeIcons[data.pageViewCountPercentageChangeVariant], {
                  className: classNames("d-block flex-grow-0 flex-shrink-0", styles.changeIndicator),
                })}

                <span>{`${data.pageViewCountPercentageChange}%`}</span>
              </Card.Subtitle>
            </Col>

            <Col className="d-flex flex-column align-items-center align-items-sm-start mt-lg-0 mt-3 text-center text-sm-start">
              <div className="mb-1 fw-semibold">Average page duration</div>

              <div className="d-flex flex-row align-items-center">
                <div className={classNames("flex-grow-0 flex-shrink-0 d-flex flex-column align-items-center justify-content-center bg-white rounded-circle text-primary border-3 border-primary border me-2 p-1", styles.iconWrapper)}>
                  <IconClockFill className="d-block" />
                </div>

                <span className="fs-5 fw-bold">{data.pageViewCountPerVisitor}</span>
              </div>

              <Card.Subtitle className={classNames("d-flex flex-row align-items-center mt-2 fw-semibold", `text-${data.averagePageViewDurationPercentageChangeVariant}`)}>
                {React.createElement(changeIcons[data.averagePageViewDurationPercentageChangeVariant], {
                  className: classNames("d-block flex-grow-0 flex-shrink-0", styles.changeIndicator),
                })}

                <span>{`${data.averagePageViewDurationPercentageChange}%`}</span>
              </Card.Subtitle>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}
