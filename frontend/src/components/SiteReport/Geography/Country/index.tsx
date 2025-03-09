import { localPoint } from "@visx/event";
import { useTooltip } from "@visx/tooltip";
import chroma from "chroma-js";
import { MouseEvent, MouseEventHandler, TouchEvent, useMemo } from "react";
import { Link, useLocation, useSearchParams } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import ChartTooltip from "~/components/ChartTooltip";
import useSiteCountryReport from "~/hooks/api/useSiteCountryReport";
import { getUpdatedSearch } from "~/lib/router";
import Modal from "./Modal";
import { map } from "./map";

type MapDatum = {
  className?: string;
  d: string;
  fill: string;
  handleClick?: MouseEventHandler<SVGPathElement>;
  handleMouseEvent?: (event: MouseEvent<SVGPathElement> | TouchEvent<SVGPathElement>) => void;
  key: string;
};

type Tooltip = {
  datum: HydratedSiteCountryReportDatum;
};

export default function Country() {
  const [location] = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: report } = useSiteCountryReport();
  const { hideTooltip, showTooltip, tooltipData, tooltipLeft, tooltipOpen, tooltipTop } = useTooltip<Tooltip>();

  const data = useMemo<Array<HydratedSiteCountryReportDatum>>(() => {
    if (report === undefined) {
      return [];
    }

    return report.reduce<Array<HydratedSiteCountryReportDatum>>((a, v) => [...a, ...v.data], []);
  }, [report]);

  const colorScale = useMemo(() => chroma.scale([
    chroma(getComputedStyle(document.body).getPropertyValue("--bs-primary")).tint(0.85).hex(),
    chroma(getComputedStyle(document.body).getPropertyValue("--bs-primary")).hex(),
  ]).domain([
    0,
    Math.max(...data.map((d) => d.visitorCount), 10),
  ]), [data]);

  const mapData = useMemo<Array<MapDatum>>(() => map.map((md) => {
    const datum = data.find((d) => d.countryISOCode === md.isoCode);

    return {
      className: datum !== undefined ? "cursor-pointer" : "",
      d: md.d,
      fill: colorScale(datum?.visitorCount || 0).toString(),
      handleClick: datum === undefined ? undefined : () => {
        setSearchParams((s) => {
          s.set("countryISOCode", datum.countryISOCode);

          return s;
        });
      },
      handleMouseEvent: datum === undefined ? undefined : (event) => {
        const coords = localPoint(document.body, event);

        if (coords === null) {
          return;
        }

        showTooltip({
          tooltipData: { datum },
          tooltipLeft: coords.x,
          tooltipTop: coords.y,
        });
      },
      key: md.isoCode,
    };
  }), [colorScale, data, showTooltip, setSearchParams]);

  return data === null ? (
    <div className="align-items-center d-flex flex-fill justify-content-center p-4">
      <ActivityIndicator />
    </div>
  ) : (
    <>
      <div className="d-flex flex-column flex-grow-1">
        <div className="flex-grow-1 row">
          <div className="col-12 col-lg-7 d-flex flex-grow-1">
            <svg className="flex-grow-1">
              <svg className="d-block mx-auto" viewBox="0 0 1008.27 650.94">
                {mapData.map((d) => (
                  <path
                    className={d.className}
                    d={d.d}
                    fill={d.fill}
                    key={d.key}
                    onClick={d.handleClick}
                    onMouseMove={d.handleMouseEvent}
                    onMouseOut={hideTooltip}
                    onTouchEnd={hideTooltip}
                    onTouchMove={d.handleMouseEvent}
                    opacity={d.key === tooltipData?.datum.countryISOCode ? 0.9 : 1}
                    stroke={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-300")}
                    tabIndex={d.handleClick === undefined ? undefined : 0}
                  />
                ))}
              </svg>
            </svg>
          </div>

          <div className="col-12 col-lg-5 d-flex flex-column mb-n8">
            <div className="border-1 border-start-lg d-flex flex-column flex-grow-1 ps-lg-8">
              <table className="fs-7 mb-0 table table-borderless table-layout-fixed table-sm w-100">
                <thead>
                  <tr>
                    <th>Country</th>

                    <th className="text-end w-5rem">Visitors</th>
                  </tr>
                </thead>

                <tbody>
                  {data.slice(0,5).map((d) => (
                    <tr className="parent" key={d.countryISOCode}>
                      <td>
                        <Link
                          className="align-items-center d-flex gap-2 text-body text-decoration-none text-decoration-underline-focus-visible text-decoration-underline-hover"
                          title={d.country}
                          to={`${location}${getUpdatedSearch(searchParams, { countryISOCode: d.countryISOCode })}`}
                        >
                          <span className="text-truncate">{d.country}</span>
                        </Link>
                      </td>

                      <td className="text-end w-5rem">{d.visitorCountDisplay}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Link
                className="bg-opacity-0 bg-opacity-10-focus-visible bg-opacity-10-hover bg-primary border-1 border-top d-block fw-medium mt-auto mx-n8 p-3 text-center text-decoration-none"
                to={`${location}${getUpdatedSearch(searchParams, { detail: "country" })}`}
              >
                See more
              </Link>
            </div>
          </div>
        </div>
      </div>

      {tooltipOpen && tooltipData !== undefined ? (
        <ChartTooltip left={tooltipLeft} top={tooltipTop}>
          <div className="text-center">
            <div className="fs-xs fw-medium">{tooltipData.datum.country}</div>
            <div className="mt-1">{`${tooltipData.datum.visitorCount} visitors (${tooltipData.datum.visitorPercentageDisplay})`}</div>
          </div>
        </ChartTooltip>
      ) : null}

      <Modal />
    </>
  );
}
