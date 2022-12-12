import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Col, Row } from "react-bootstrap";
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

  return data === null ? null : (
    <>
      <div className="d-flex flex-column flex-grow-1 min-h-0">
        <Row className="flex-grow-1">
          <Col lg={7}>
            <div className="h-100 ps-3">
              <Chart data={data} />
            </div>
          </Col>

          <Col className="d-flex flex-column" lg={5}>
            <div className="border-1 border-start flex-grow-1 fss-1 lh-lg pb-3 pe-3 ps-3">
              <div className="d-flex flex-row py-1">
                <div className="flex-grow-1 fw-semibold pe-1">Language</div>

                <div className="fw-semibold ps-1 text-end w-4rem" title="Visitor count">Visitors</div>
              </div>

              {data.map((d) => (
                <div className="align-items-center d-flex d-parent flex-row lh-lg" key={d.language}>
                  <div className="align-items-center d-flex flex-grow-1 flex-row pe-1 overflow-hidden">
                    <Link
                      className="text-body text-decoration-none text-decoration-underline-hover text-truncate"
                      href={{ pathname: router.pathname, query: { ...router.query, language: d.language } }}
                      scroll={false}
                      title={d.language}
                    >
                      {d.language}
                    </Link>
                  </div>

                  <div className="ps-1 text-end w-4rem" title={d.visitorPercentageDisplay}>{d.visitorCount}</div>
                </div>
              ))}
            </div>

            <Link
              className="bg-light-hover border-1 border-top border-start d-block fw-medium mt-auto py-2 text-center text-decoration-none"
              href={{ pathname: router.pathname, query: { ...router.query, detail: "language" } }}
              scroll={false}
            >
              See more
            </Link>
          </Col>
        </Row>
      </div>

      <Modal />
    </>
  );
}
