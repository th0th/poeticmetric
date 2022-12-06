import classNames from "classnames";
import React from "react";
import { Card, CardProps } from "react-bootstrap";
import { Chart } from "./Chart";

export type SiteVisitorTrendsReportProps = Omit<CardProps, "children">;

export function SiteVisitorTrendsReport({ className, ...props }: SiteVisitorTrendsReportProps) {
  return (
    <Card {...props} className={classNames("site-report-card", className)}>
      <Card.Body className="d-flex flex-column">
        <div className="align-items-center d-flex flex-row gap-3 mb-2 pe-3 ps-3">
          <Card.Title className="fs-6 mb-0">Time trends</Card.Title>
        </div>

        <div className="flex-grow-1">
          <Chart />
        </div>
      </Card.Body>
    </Card>
  );
}