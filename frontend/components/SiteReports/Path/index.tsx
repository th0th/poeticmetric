import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Card, CardProps, Spinner, Table } from "react-bootstrap";
import { useSitePathReport } from "../../../hooks";
import { NoData } from "../NoData";
import { Modal } from "./Modal";

export type SitePathReportProps = Omit<CardProps, "children">;

type Data = Array<HydratedSitePathDatum>;

export function Path({ className, ...props }: SitePathReportProps) {
  const router = useRouter();
  const { data: rawData } = useSitePathReport();

  const data = useMemo<Data | null>(() => {
    if (rawData === undefined) {
      return null;
    }

    return rawData[0].data.slice(0, 5);
  }, [rawData]);

  const contentNode = useMemo<React.ReactNode>(() => {
    if (data === null) {
      return (
        <Spinner className="m-auto" variant="primary" />
      );
    }

    if (data.length === 0) {
      return (
        <NoData />
      );
    }

    return (
      <>
        <Table borderless className="fs-sm table-layout-fixed" responsive size="sm">
          <thead>
            <tr>
              <th className="w-5rem">Page</th>
              <th />

              <th className="text-end w-4rem">Visitors</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr className="parent-d" key={d.path}>
                <td colSpan={2}>
                  <div className="align-items-center d-flex flex-grow-1 flex-row min-w-0 pe-1">
                    <Link
                      className="text-body text-decoration-none text-decoration-underline-hover text-truncate"
                      href={{ pathname: router.pathname, query: { ...router.query, path: d.path } }}
                      scroll={false}
                      title={d.path}
                    >
                      {d.path}
                    </Link>

                    <a
                      className="parent-d-block flex-grow-0 flex-shrink-0 lh-1 ms-2 text-black text-primary-hover"
                      href={d.url}
                      rel="noreferrer"
                      target="_blank"
                      title="Go to the page"
                    >
                      <i className="bi bi-box-arrow-up-right h-1rem" />
                    </a>
                  </div>
                </td>

                <td className="text-end w-4rem">
                  <span className="fw-medium" title={d.visitorCount.toString()}>{d.visitorCountDisplay}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Link
          className="bg-light-hover border-1 border-top d-block fw-semibold mb-n3 mt-auto mx-n3 p-2 rounded-bottom text-center text-decoration-none"
          href={{ pathname: router.pathname, query: { ...router.query, detail: "path" } }}
          scroll={false}
        >
          See more
        </Link>
      </>
    );
  }, [data, router.pathname, router.query]);

  return (
    <>
      <Card {...props} className={`site-report-card ${className}`}>
        <Card.Body className="d-flex flex-column">
          <div className="align-items-center d-flex flex-row mb-3">
            <h6 className="mb-0">Pages</h6>
          </div>

          {contentNode}
        </Card.Body>
      </Card>

      <Modal />
    </>
  );
}
