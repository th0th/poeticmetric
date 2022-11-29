import classNames from "classnames";
import Link from "next/link";
import React, { useContext, useMemo } from "react";
import { Card, CardProps } from "react-bootstrap";
import { SiteReportsFiltersContext } from "../../contexts";
import { Site } from "./Site";
import { Path } from "./Path";

export type SiteReferrerReportProps = Omit<CardProps, "children">;

export function SiteReferrerReport({ className, ...props }: SiteReferrerReportProps) {
  const { referrerSite } = useContext(SiteReportsFiltersContext);

  const contentNode = useMemo<React.ReactNode>(() => referrerSite === null ? <Site /> : <Path />, [referrerSite]);

  return (
    <Card {...props} className={classNames("d-flex site-report-card", className)}>
      <Card.Body className="d-flex flex-column flex-grow-1 flex-shrink-1">
        <div className="align-items-center d-flex flex-row gap-3 mb-2 pe-3">
          <Card.Title className="fs-6 mb-0">Referrer</Card.Title>
        </div>

        {contentNode}
      </Card.Body>

      <Link className="bg-light-hover border-1 border-top d-block fw-medium py-2 text-center text-decoration-none" href="/" scroll={false}>
        See more
      </Link>
    </Card>
  );
}
