import { localPoint } from "@visx/event";
import { useTooltip } from "@visx/tooltip";
import chroma from "chroma-js";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Col, Row, Spinner, Table } from "react-bootstrap";
import { useSiteCountryReport } from "../../../../hooks";
import { ChartTooltip } from "../../..";
import { NoData } from "../../NoData";
import { map } from "./map";
import { Modal } from "./Modal";

type State = {
  data: Array<HydratedSiteCountryDatum>;
  mapData: Array<StateMapDatum>;
};

type StateMapDatum = {
  className?: string;
  d: string;
  fill: string;
  handleClick?: React.MouseEventHandler<SVGPathElement>;
  handleMouseEvent?: (event: React.MouseEvent<SVGPathElement> | React.TouchEvent<SVGPathElement>) => void;
  key: string;
};

type Tooltip = {
  datum: HydratedSiteCountryDatum;
};

export function Country() {
  const router = useRouter();
  const { data: report } = useSiteCountryReport();
  const { hideTooltip, showTooltip: rawShowTooltip, tooltipData, tooltipLeft, tooltipOpen, tooltipTop } = useTooltip<Tooltip>();

  const state = useMemo<State | null>(() => {
    if (report === undefined) {
      return null;
    }

    const colorScale = chroma
      .scale([
        "#EBF8FF",
        "#BEE3F8",
        "#90CDF4",
        "#63B3ED",
        "#4299E1",
        "#3182CE",
        "#3182CE",
        "#2B6CB0",
        "#2C5282",
        "#2A4365",
        "#1A365D",
      ])
      .domain([0, Math.max(report.reduce<number>((a, d) => d.visitorCount > a ? d.visitorCount : a, 0), 10)]);

    const mapData: State["mapData"] = map.map((md) => {
      const datum = report.find((rd) => rd.countryIsoCode === md.isoCode);

      const visitorCount = datum?.visitorCount || 0;

      return {
        className: visitorCount !== 0 ? "cursor-pointer" : undefined,
        d: md.d,
        fill: colorScale(visitorCount).toString(),
        handleClick: datum === undefined ? undefined : async () => {
          await router.push({
            pathname: router.pathname,
            query: { ...router.query, countryIsoCode: datum.countryIsoCode },
          }, undefined, { scroll: false });
        },
        handleMouseEvent: datum === undefined ? undefined : (event) => {
          const coords = localPoint(document.body, event);

          if (coords === null) return;

          rawShowTooltip({
            tooltipData: {
              datum: datum,
            },
            tooltipLeft: coords.x,
            tooltipTop: coords.y,
          });
        },
        key: md.isoCode,
      };
    });

    return {
      data: report.slice(0, 5),
      mapData,
    };
  }, [rawShowTooltip, report, router]);

  const contentNode = useMemo<React.ReactNode>(() => {
    if (state === null) {
      return (
        <Spinner className="m-auto" variant="primary" />
      );
    }

    if (state.data.length === 0) {
      return (
        <NoData />
      );
    }

    return (
      <>
        <div className="d-flex flex-column flex-grow-1 min-h-0">
          <Row className="min-h-0">
            <Col className="flex-grow-1 mh-100 pb-3" lg={7}>
              <svg className="d-block mh-100 mx-auto" viewBox="0 0 1008.27 650.94">
                {state.mapData.map((md) => (
                  <path
                    className={md.className}
                    d={md.d}
                    fill={md.fill}
                    key={md.key}
                    onClick={md.handleClick}
                    onMouseMove={md.handleMouseEvent}
                    onMouseOut={hideTooltip}
                    onTouchEnd={hideTooltip}
                    onTouchMove={md.handleMouseEvent}
                    opacity={md.key === tooltipData?.datum.countryIsoCode ? 0.9 : 1}
                    stroke={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-300")}
                    tabIndex={md.handleClick === undefined ? undefined : 0}
                  />
                ))}
              </svg>
            </Col>

            <Col className="d-flex flex-column" lg={5}>
              <div className="border-1 border-start-lg d-flex flex-column flex-grow-1 mb-n3 ps-lg-3">
                <Table borderless className="fs-sm table-layout-fixed" responsive size="sm">
                  <thead>
                    <tr>
                      <th className="w-5rem">Country</th>
                      <th />

                      <th className="text-end w-4rem">Visitors</th>
                    </tr>
                  </thead>

                  <tbody>
                    {state.data.map((d) => (
                      <tr className="parent-d" key={d.countryIsoCode}>
                        <td colSpan={2}>
                          <Link
                            className="align-items-center d-flex parent-text-decoration flex-row text-body text-decoration-none"
                            href={{ pathname: router.pathname, query: { ...router.query, countryIsoCode: d.countryIsoCode } }}
                            scroll={false}
                            title={d.country}
                          >
                            <span className={`fi fi-${d.countryIsoAlpha2Code} fis me-1 rounded-circle shadow-sm text-decoration-none`} />

                            <span className="parent-hover-text-decoration-underline text-truncate">{d.country}</span>
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
                  className="bg-light-hover border-1 border-top d-block fw-semibold mt-auto mx-n3 p-2 rounded-bottom rounded-bottom-end-lg text-center text-decoration-none"
                  href={{ pathname: router.pathname, query: { ...router.query, detail: "country" } }}
                  scroll={false}
                >
                  See more
                </Link>
              </div>
            </Col>
          </Row>
        </div>
      </>
    );
  }, [hideTooltip, router.pathname, router.query, state, tooltipData]);

  return (
    <>
      {contentNode}

      <Modal />

      {tooltipOpen && tooltipData !== undefined ? (
        <ChartTooltip left={tooltipLeft} top={tooltipTop}>
          <div className="text-center">
            <div className="fs-xs fw-medium">{tooltipData.datum.country}</div>
            <div className="mt-1">{`${tooltipData.datum.visitorCount} visitors (${tooltipData.datum.visitorPercentageDisplay})`}</div>
          </div>
        </ChartTooltip>
      ) : null}
    </>
  );
}
