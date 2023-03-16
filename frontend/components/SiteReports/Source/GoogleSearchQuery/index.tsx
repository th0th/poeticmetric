import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Spinner, Table } from "react-bootstrap";
import { useSiteGoogleSearchQueryReport } from "../../../../hooks";
import { NoData } from "../../NoData";
import { Modal } from "./Modal";

type Data = HydratedSiteGoogleSearchQueryReport;

export function GoogleSearchQuery() {
  const router = useRouter();
  const { data: rawData } = useSiteGoogleSearchQueryReport();

  const data = useMemo<Data | null>(() => {
    if (rawData === undefined) {
      return null;
    }

    return rawData[0].slice(0, 5);
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
              <th className="w-7rem">Term</th>
              <th />

              <th className="text-end w-4rem">Visitors</th>
            </tr>
          </thead>

          <tbody>
            {data.map((d) => (
              <tr className="parent-d" key={d.query}>
                <td colSpan={2}>
                  <span className="text-body text-truncate" title={d.query}>
                    {d.query}
                  </span>
                </td>

                <td className="text-end w-4rem">
                  <span className="fw-medium" title={d.clicks.toString()}>{d.clicksDisplay}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>

        <Link
          className="bg-light-hover border-1 border-top d-block fw-semibold mb-n3 mt-auto mx-n3 p-2 rounded-bottom text-center text-decoration-none"
          href={{ pathname: router.pathname, query: { ...router.query, detail: "google-search-query" } }}
          scroll={false}
        >
          See more
        </Link>

        <Modal />
      </>
    );
  }, [data, router.pathname, router.query]);

  return (
    <>{contentNode}</>
  );
}
