import classNames from "classnames";
import React from "react";
import { Card, CardProps, Form } from "react-bootstrap";
import { PageViews } from "./PageViews";

export type SitePageViewsAndVisitorsReportProps = Omit<CardProps, "children">;

export function SitePageViewsAndVisitorsReport({ className, ...props }: SitePageViewsAndVisitorsReportProps) {
  return (
    <Card {...props} className={classNames("h-100", className)}>
      <Card.Body className="d-flex flex-column flex-grow-1">
        <div className="align-items-center d-flex flex-row gap-3 mb-2">
          <Card.Title className="fs-6 mb-0">Page views and visitors</Card.Title>

          <div className="ms-auto">
            <Form.Select size="sm">
              <option>Page views</option>
              <option>Visitors</option>
            </Form.Select>
          </div>
        </div>

        <PageViews />
      </Card.Body>
    </Card>
  );
}
