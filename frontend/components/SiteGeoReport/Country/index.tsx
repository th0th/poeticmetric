import { localPoint } from "@visx/event";
import { useTooltip } from "@visx/tooltip";
import chroma from "chroma-js";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import { useSiteCountryReport } from "../../../hooks";
import { ChartTooltip } from "../../ChartTooltip";
import { map } from "./map";

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
  const { hydratedData: report } = useSiteCountryReport();
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
      .domain([0, Math.max(...report.map((d) => d.visitorCount))]);

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

  return state === null ? null : (
    <>
      <Row className="min-h-0">
        <Col className="h-100 pb-3" lg={7}>
          <svg className="d-block mx-auto mh-100" viewBox="0 0 1008.27 650.94">
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
                stroke={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-300")}
              />
            ))}
          </svg>
        </Col>

        <Col className="d-flex flex-column" lg={5}>
          <div className="border-1 border-start flex-grow-1 fss-1 lh-lg pb-3 pe-3 ps-3">
            <div className="d-flex flex-row py-1">
              <div className="flex-grow-1 fw-semibold pe-1">Page</div>

              <div className="fw-semibold ps-1 text-end w-4rem" title="View count">Views</div>
            </div>

            {state.data.map((d) => (
              <div className="align-items-center d-flex d-parent flex-row lh-lg" key={d.countryIsoCode}>
                <div className="align-items-center d-flex flex-grow-1 flex-row pe-1 overflow-hidden">
                  <Link className="text-body text-decoration-none text-decoration-underline-hover text-truncate" href="/" title={d.country}>
                    {d.country}
                  </Link>
                </div>

                <div className="text-end ps-1 w-4rem" title="View count">{d.visitorCount}</div>
              </div>
            ))}
          </div>

          <Link
            className="bg-light-hover border-1 border-top border-start d-block fw-medium mt-auto py-2 text-center text-decoration-none"
            href={{ pathname: router.pathname, query: { ...router.query, detail: "country" } }}
            scroll={false}
          >
            See more
          </Link>
        </Col>
      </Row>

      {tooltipOpen && tooltipData !== undefined ? (
        <ChartTooltip left={tooltipLeft} top={tooltipTop}>
          <div className="text-center">
            <div className="fss-2 fw-medium">{tooltipData.datum.country}</div>

            <div className="mt-1">{`${tooltipData.datum.visitorCount} visitors (${tooltipData.datum.visitorPercentageDisplay})`}</div>
          </div>
        </ChartTooltip>
      ) : null}
    </>
  );
}
