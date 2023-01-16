import classNames from "classnames";
import React from "react";
import { Card, CardProps } from "react-bootstrap";
import { Chart } from "./Chart";

export type TimeTrendsProps = Omit<CardProps, "children">;

export function TimeTrends({ className, ...props }: TimeTrendsProps) {
  return (
    <Card {...props} className={classNames("site-report-card", className)}>
      <Card.Body className="d-flex flex-column">
        <div className="align-items-center d-flex flex-row mb-3">
          <h6 className="mb-0">Time trends</h6>
        </div>

        <Chart />
      </Card.Body>
    </Card>
  );
}
