import { AxisBottom, AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";
import { EventType } from "@visx/event/lib/types";
import { GridColumns } from "@visx/grid";
import { Group } from "@visx/group";
import { useParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { useTooltip } from "@visx/tooltip";
import { useCallback, useMemo } from "react";
import { Link, useLocation } from "react-router";
import ActivityIndicator from "~/components/ActivityIndicator";
import ChartTooltip from "~/components/ChartTooltip";
import NoData from "~/components/NoData";
import { axisLeftTickFormat } from "~/components/SiteReport/Geography/Language/Chart";
import useSiteDeviceTypeReport from "~/hooks/api/useSiteDeviceTypeReport";
import { getUpdatedLocation } from "~/lib/router";

type InnerDevicesProps = {
  report: HydratedSiteDeviceTypeReport;
};

type Tooltip = {
  datum: HydratedSiteDeviceTypeReportDatum;
};

const padding = { bottom: 24, left: 64, right: 30, top: 8 };

export default function Devices() {
  const { data: report } = useSiteDeviceTypeReport();

  return report === undefined ? (
    <div className="align-items-center d-flex flex-fill justify-content-center p-4">
      <ActivityIndicator />
    </div>
  ) : (
    <>
      {report.length === 0 ? (
        <NoData />
      ) : (
        <InnerDevices report={report} />
      )}
    </>
  );
}

function InnerDevices({ report }: InnerDevicesProps) {
  const location = useLocation();
  const { height: parentHeight, parentRef, width: parentWidth } = useParentSize();
  const height = useMemo(() => Math.max(parentHeight, 180) || 0, [parentHeight]);
  const innerHeight = useMemo(() => height - padding.top - padding.bottom, [height]);
  const width = useMemo(() => parentWidth || 0, [parentWidth]);
  const innerWidth = useMemo(() => width - padding.left - padding.right, [width]);
  const xMax = useMemo(() => Math.max(...report.map((d) => d.visitorCount || 0), 10), [report]);
  const xDomain = useMemo(() => [0, xMax], [xMax]);
  const xScale = useMemo(() => scaleLinear({ domain: xDomain, range: [0, innerWidth] }), [innerWidth, xDomain]);
  const yDomain = useMemo(() => report.map((d) => d.deviceTypeDisplay), [report]);
  const yScale = useMemo(() => scaleBand({ domain: yDomain, padding: 0.4, range: [0, innerHeight] }), [innerHeight, yDomain]);
  const bandwidth = useMemo(() => yScale.bandwidth(), [yScale]);
  const chartData = useMemo(() => report.map((d) => {
    const width = xScale(d.visitorCount);
    const y = yScale(d.deviceTypeDisplay);

    return {
      ...d,
      width,
      y,
    };
  }), [report, xScale, yScale]);
  const { hideTooltip, showTooltip: rawShowTooltip, tooltipData, tooltipLeft, tooltipOpen, tooltipTop } = useTooltip<Tooltip>();

  const showTooltip = useCallback((
    event: EventType,
    datum: HydratedSiteDeviceTypeReportDatum,
  ) => {
    const bodyLocalPoint = localPoint(document.body, event);
    if (bodyLocalPoint === null) return;

    rawShowTooltip({
      tooltipData: {
        datum,
      },
      tooltipLeft: bodyLocalPoint.x,
      tooltipTop: bodyLocalPoint.y,
    });
  }, [rawShowTooltip]);

  return (
    <div ref={parentRef}>
      {height === 0 || width === 0 ? null : (
        <svg className="d-block" height={height} width={width}>
          <Group left={padding.left} top={padding.top}>
            <GridColumns height={innerHeight} scale={xScale} />

            <AxisBottom
              axisLineClassName="stroke-0"
              hideTicks
              scale={xScale}
              tickFormat={axisLeftTickFormat}
              tickValues={xDomain}
              top={innerHeight}
            />

            <AxisLeft
              axisLineClassName="stroke-0"
              scale={yScale}
              tickStroke="transparent"
              tickValues={yDomain}
            />

            <Group>
              {chartData.map((d) => (
                <Bar
                  className="fill-current-color text-primary"
                  height={bandwidth}
                  key={d.deviceTypeDisplay}
                  width={d.width}
                  x={0}
                  y={d.y}
                />
              ))}
            </Group>
          </Group>

          <Group top={padding.top}>
            {chartData.map((d) => (
              <Link
                key={d.deviceTypeDisplay}
                preventScrollReset
                to={getUpdatedLocation(location, { search: { deviceType: d.deviceType } })}
              >
                <rect
                  className="cursor-pointer"
                  fill="transparent"
                  height={bandwidth}
                  onMouseLeave={hideTooltip}
                  onMouseMove={(event) => showTooltip(event, d)}
                  onTouchEnd={hideTooltip}
                  onTouchMove={(event) => showTooltip(event, d)}
                  tabIndex={0}
                  width={width}
                  x={0}
                  y={d.y}
                />
              </Link>
            ))}
          </Group>
        </svg>
      )}

      {tooltipOpen && tooltipData !== undefined ? (
        <ChartTooltip left={tooltipLeft} top={tooltipTop}>
          <div className="text-center">
            <div className="fs-8 fw-medium">{tooltipData.datum.deviceTypeDisplay}</div>
            <div className="mt-1">{`${tooltipData.datum.visitorCount} visitors (${tooltipData.datum.visitorPercentageDisplay})`}</div>
          </div>
        </ChartTooltip>
      ) : null}
    </div>
  );
}
