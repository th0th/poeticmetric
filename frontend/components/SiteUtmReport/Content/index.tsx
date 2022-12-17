import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Spinner, Table } from "react-bootstrap";
import { useSiteUtmContentReport } from "../../../hooks";
import { Modal } from "./Modal";

type Data = Array<HydratedSiteUtmContentDatum>;

export function Content() {
  const router = useRouter();
  const { data: rawData } = useSiteUtmContentReport();

  const data = useMemo<Data | null>(() => {
    if (rawData === undefined) {
      return null;
    }

    return rawData[0].data.slice(0, 5);
  }, [rawData]);

  return (
    <>
      {data === null ? (
        <Spinner className="m-auto" />
      ) : (
        <>
          <Table borderless className="fs-sm table-layout-fixed" responsive size="sm">
            <thead>
              <tr>
                <th className="w-7rem">UTM content</th>
                <th />

                <th className="text-end w-4rem">Visitors</th>
              </tr>
            </thead>

            <tbody>
              {data.map((d) => (
                <tr className="parent-d" key={d.utmContent}>
                  <td colSpan={2}>
                    <Link
                      className="text-body text-decoration-none text-decoration-underline-hover text-truncate"
                      href={{ pathname: router.pathname, query: { ...router.query, utmContent: d.utmContent } }}
                      scroll={false}
                      title={d.utmContent}
                    >
                      {d.utmContent}
                    </Link>
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
            href={{ pathname: router.pathname, query: { ...router.query, detail: "utm-content" } }}
            scroll={false}
          >
            See more
          </Link>
        </>
      )}

      <Modal />
    </>
  );
}
