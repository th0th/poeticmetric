import classNames from "classnames";
import React, { useContext, useMemo } from "react";
import { Card, CardProps } from "react-bootstrap";
import { SiteReportsFiltersContext } from "../../contexts";
import { Path } from "./Path";
import { Site } from "./Site";

export type SiteReferrerReportProps = Omit<CardProps, "children">;

export function SiteReferrerReport({ className, ...props }: SiteReferrerReportProps) {
  const { referrerSite } = useContext(SiteReportsFiltersContext);

  const contentNode = useMemo<React.ReactNode>(() => referrerSite === null ? <Site /> : <Path />, [referrerSite]);

  return (
    <Card {...props} className={classNames("d-flex site-report-card", className)}>
      <Card.Body className="d-flex flex-column flex-grow-1 flex-shrink-1">
        <div className="align-items-center d-flex flex-row mb-3">
          <h6 className="mb-0">Referrers</h6>
        </div>

        {contentNode}
      </Card.Body>
    </Card>
  );
}
