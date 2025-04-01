import { AxisLeft, AxisTop, TickFormatter } from "@visx/axis";
import { localPoint } from "@visx/event";
import { EventType } from "@visx/event/lib/types";
import { Group } from "@visx/group";
import { useParentSize } from "@visx/responsive";
import { scaleBand } from "@visx/scale";
import { Bar } from "@visx/shape";
import { useTooltip } from "@visx/tooltip";
import chroma from "chroma-js";
import dayjs from "dayjs";
import { range } from "lodash-es";
import { useCallback, useMemo } from "react";
import ActivityIndicator from "~/components/ActivityIndicator";
import ChartTooltip from "~/components/ChartTooltip";
import useSiteTimeOfWeekTrendsReport from "~/hooks/api/useSiteTimeOfWeekTrendsReport";

type InnerTimeOfWeekTrendsProps = {
  report: HydratedSiteTimeOfWeekTrendsReport;
};

const padding = { bottom: 2, left: 32, right: 0, top: 18 };

type Tooltip = HydratedSiteTimeOfWeekTrendsReportDatum;

function InnerTimeOfWeekTrends({ report }: InnerTimeOfWeekTrendsProps) {
  const { height: parentHeight, parentRef, width: parentWidth } = useParentSize();
  const height = useMemo(() => Math.max(parentHeight, 180) || 0, [parentHeight]);
  const innerHeight = useMemo(() => height - padding.top - padding.bottom, [height]);
  const width = useMemo(() => parentWidth || 0, [parentWidth]);
  const innerWidth = useMemo(() => width - padding.left - padding.right, [width]);
  const xDomain = useMemo(() => range(0, 24, 2), []);
  const xScale = useMemo(() => scaleBand({ domain: xDomain, padding: 0.3, range: [0, innerWidth] }), [innerWidth, xDomain]);
  const xTickValues = useMemo(() => range(0, 24, 4), []);
  const yDomain = useMemo(() => range(1, 8), []);
  const yTickValues = useMemo(() => yDomain, [yDomain]);
  const yScale = useMemo(() => scaleBand({ domain: yDomain, padding: 0.3, range: [0, innerHeight] }), [innerHeight, yDomain]);
  const colorScale = useMemo(() => chroma.scale([
    chroma(getComputedStyle(document.body).getPropertyValue("--bs-primary")).tint(0.85).hex(),
    chroma(getComputedStyle(document.body).getPropertyValue("--bs-primary")).hex(),
  ]).domain([
    0,
    Math.max(...report.map((d) => d.viewCount), 10),
  ]), [report]);
  const chartData = useMemo(() => report.map((d) => {
    const color = colorScale(d.viewCount).hex();
    const x = xScale(d.hourOfDay);
    const y = yScale(d.dayOfWeek);
    const width = xScale.bandwidth();
    const height = yScale.bandwidth();

    return { ...d, color, height, width, x, y };
  }), [colorScale, report, xScale, yScale]);
  const { hideTooltip, showTooltip: rawShowTooltip, tooltipData, tooltipLeft, tooltipOpen, tooltipTop } = useTooltip<Tooltip>();

  const axisLeftTickFormat = useCallback<TickFormatter<number>>((value) => {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][value - 1];
  }, []);

  const axisTopTickFormat = useCallback<TickFormatter<number>>((value) => {
    return dayjs(`1996-01-30 ${value}:00:00`).format("h A");
  }, []);

  const showTooltip = useCallback((
    event: EventType,
    datum: HydratedSiteTimeOfWeekTrendsReportDatum,
  ) => {
    const bodyLocalPoint = localPoint(document.body, event);
    if (bodyLocalPoint === null) return;

    rawShowTooltip({
      tooltipData: datum,
      tooltipLeft: bodyLocalPoint.x,
      tooltipTop: bodyLocalPoint.y,
    });
  }, [rawShowTooltip]);

  return (
    <>
      <div className="flex-grow-1" ref={parentRef}>
        <svg className="d-block" height={height} width={width}>
          <Group left={padding.left} top={padding.top}>
            <AxisTop hideAxisLine hideTicks scale={xScale} tickFormat={axisTopTickFormat} tickValues={xTickValues} top={12} />

            <AxisLeft hideAxisLine hideTicks left={8} scale={yScale} tickFormat={axisLeftTickFormat} tickValues={yTickValues} />

            <Group>
              {chartData.map((d) => (
                <Bar
                  fill={d.color}
                  height={d.height}
                  key={`${d.dayOfWeek}-${d.hourOfDay}`}
                  onMouseLeave={hideTooltip}
                  onMouseMove={(event) => showTooltip(event, d)}
                  onTouchEnd={hideTooltip}
                  onTouchMove={(event) => showTooltip(event, d)}
                  rx={2}
                  ry={2}
                  width={d.width}
                  x={d.x}
                  y={d.y}
                />
              ))}
            </Group>
          </Group>
        </svg>
      </div>

      {tooltipOpen && tooltipData !== undefined ? (
        <ChartTooltip className="text-center" left={tooltipLeft} top={tooltipTop}>
          <div className="fw-medium">{tooltipData.dayOfWeekDisplay}</div>

          <div className="fs-8 mt-1">
            {tooltipData.hourOfDayStartDisplay}

            {" "}
            &rarr;
            {" "}

            {tooltipData.hourOfDayEndDisplay}
          </div>

          <div className="mt-2">
            <span className="fw-medium">{tooltipData.viewCount} page views</span>

            <div className="fs-8">({tooltipData.viewPercentageDisplay})</div>
          </div>
        </ChartTooltip>
      ) : null}
    </>
  );
}

export default function TimeOfWeekTrends() {
  const { data: report } = useSiteTimeOfWeekTrendsReport();

  return (
    <>
      <div className="card">
        <div className="card-body d-flex flex-column h-18rem">
          <div className="align-items-center d-flex flex-grow-0 flex-shrink-0 h-2rem mb-6">
            <div className="fw-medium">Time of week trends</div>
          </div>

          {report === undefined ? (
            <div className="align-items-center d-flex flex-fill justify-content-center p-4">
              <ActivityIndicator />
            </div>
          ) : (
            <InnerTimeOfWeekTrends report={report} />
          )}
        </div>
      </div>
    </>
  );
}
