import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Col, Row, Spinner, Table } from "react-bootstrap";
import { useSiteLanguageReport } from "../../../hooks";
import { Chart } from "./Chart";
import { Modal } from "./Modal";

type Data = Array<HydratedSiteLanguageDatum>;

export function Language() {
  const router = useRouter();
  const { data: rawData } = useSiteLanguageReport();

  const data = useMemo<Data | null>(() => {
    if (rawData === undefined) {
      return null;
    }

    return rawData[0].data.slice(0, 5);
  }, [rawData]);

  return (
    <>
      <div className="d-flex flex-column flex-grow-1 min-h-0 mb-n3">
        {data === null ? (
          <Spinner className="m-auto" />
        ) : (
          <div className="d-flex flex-column flex-grow-1">
            <Row className="flex-grow-1">
              <Col lg={7}>
                <Chart data={data} />
              </Col>

              <Col className="d-flex flex-column" lg={5}>
                <div className="border-1 border-start d-flex flex-column flex-grow-1 ps-3">
                  <Table borderless className="fss-1 table-layout-fixed" responsive size="sm">
                    <thead>
                      <tr>
                        <th className="w-5rem">Language</th>
                        <th />

                        <th className="text-end w-4rem">Visitors</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.map((d) => (
                        <tr className="d-parent" key={d.language}>
                          <td colSpan={2}>
                            <Link
                              className="text-body text-decoration-none text-decoration-underline-hover text-truncate"
                              href={{ pathname: router.pathname, query: { ...router.query, language: d.language } }}
                              scroll={false}
                              title={d.language}
                            >
                              {d.language}
                            </Link>
                          </td>

                          <td className="text-end w-4rem">
                            <span className="fw-medium" title={`${d.visitorCount.toString()} visitors`}>{d.visitorCountDisplay}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <Link
                    className="bg-light-hover border-1 border-top d-block fw-medium mt-auto mx-n3 p-2 rounded-bottom-end text-center text-decoration-none"
                    href={{ pathname: router.pathname, query: { ...router.query, detail: "language" } }}
                    scroll={false}
                  >
                    See more
                  </Link>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>

      <Modal />
    </>
  );
}
