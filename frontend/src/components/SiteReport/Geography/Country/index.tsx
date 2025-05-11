import { localPoint } from "@visx/event";
import { useTooltip } from "@visx/tooltip";
import chroma from "chroma-js";
import { MouseEvent, TouchEvent, useMemo } from "react";
import { Link, useLocation } from "react-router";
import ActivityIndicator from "~/components/ActivityIndicator";
import ChartTooltip from "~/components/ChartTooltip";
import NoData from "~/components/NoData";
import useSiteCountryReport from "~/hooks/api/useSiteCountryReport";
import { getUpdatedLocation } from "~/lib/router";
import Modal from "./Modal";
import { isoCodePaths } from "./map";

type InnerCountryProps = {
  report: Array<HydratedSiteCountryReport>;
};

type MapDatum = {
  d: string;
  datum: HydratedSiteCountryReportDatum | null;
  isoCode: string;
};

type Tooltip = {
  datum: HydratedSiteCountryReportDatum;
};

export default function Country() {
  const { data: report } = useSiteCountryReport();

  return report === undefined ? (
    <div className="align-items-center d-flex flex-fill justify-content-center p-4">
      <ActivityIndicator />
    </div>
  ) : (
    <>
      {report[0].data.length === 0 ? (
        <NoData />
      ) : (
        <InnerCountry report={report} />
      )}
    </>
  );
}

function InnerCountry({ report }: InnerCountryProps) {
  const location = useLocation();
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

  const mapData = useMemo<Array<MapDatum>>(() => isoCodePaths.map((d) => {
    return {
      ...d,
      datum: data.find((dd) => dd.countryISOCode === d.isoCode) || null,
    };
  }), [data]);

  function handleMouseEvent(event: MouseEvent<SVGPathElement> | TouchEvent<SVGPathElement>, datum: HydratedSiteCountryReportDatum | null) {
    if (datum === null) {
      return;
    }

    const coords = localPoint(document.body, event);

    if (coords === null) {
      return;
    }

    showTooltip({
      tooltipData: { datum },
      tooltipLeft: coords.x,
      tooltipTop: coords.y,
    });
  }

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
                {mapData.map((d) => {
                  const path = (
                    <path
                      d={d.d}
                      fill={colorScale(d.datum?.visitorCount || 0).toString()}
                      key={d.isoCode}
                      onMouseMove={(event) => handleMouseEvent(event, d.datum)}
                      onMouseOut={hideTooltip}
                      opacity={d.isoCode === tooltipData?.datum.countryISOCode ? 0.9 : 1}
                      stroke={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-300")}
                    />
                  );

                  return d.datum === null ? path : (
                    <Link
                      key={d.isoCode}
                      preventScrollReset
                      to={getUpdatedLocation(location, { search: { countryISOCode: d.datum?.countryISOCode } })}
                    >
                      {path}
                    </Link>
                  );
                })}
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
                  {data.slice(0, 5).map((d) => (
                    <tr className="parent" key={d.countryISOCode}>
                      <td>
                        <Link
                          className="align-items-center d-flex gap-2 text-body text-decoration-none text-decoration-underline-focus-visible text-decoration-underline-hover"
                          preventScrollReset
                          title={d.country}
                          to={getUpdatedLocation(location, { search: { countryISOCode: d.countryISOCode } })}
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
                preventScrollReset
                to={getUpdatedLocation(location, { search: { detail: "country" } })}
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
