import { AxisBottom, AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";
import { EventType } from "@visx/event/lib/types";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { useParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { Circle, Line, LinePath } from "@visx/shape";
import { useTooltip } from "@visx/tooltip";
import classNames from "classnames";
import { bisector } from "d3-array";
import { Dayjs } from "dayjs";
import { JSX, PropsWithoutRef, useCallback, useMemo } from "react";
import ActivityIndicator from "~/components/ActivityIndicator";
import ChartTooltip from "~/components/ChartTooltip";
import TimeChartAxisBottomTick, {
  timeChartAxisBottomTickFormat,
  timeChartAxisBottomTickLabelProps,
} from "~/components/TimeChartAxisBottomTick";
import useSitePageViewReport from "~/hooks/api/useSitePageViewReport";
import useSiteReportData from "~/hooks/useSiteReportData";
import styles from "./PageViews.module.scss";

type ChartDatum = Overwrite<HydratedSitePageViewReportDatum, {
  x: number;
  y: number | null;
}>;

type InnerPageViewsProps = Overwrite<PageViewsProps, {
  report: HydratedSitePageViewReport;
}>;

type Tooltip = {
  datum: ChartDatum;
  end: Dayjs;
  start: Dayjs;
};

export type PageViewsProps = Omit<PropsWithoutRef<JSX.IntrinsicElements["svg"]>, "children">;

const padding = { bottom: 30, left: 54, top: 8 };

const xBisect = bisector((d: HydratedSitePageViewReportDatum) => d.dateTimeDate).center;

function InnerPageViews({ className, report, ...props }: InnerPageViewsProps) {
  const { height: parentHeight, parentRef, width: parentWidth } = useParentSize();
  const { filters } = useSiteReportData();
  const height = useMemo(() => parentHeight || 0, [parentHeight]);
  const innerHeight = useMemo(() => height - padding.top - padding.bottom, [height]);
  const width = useMemo(() => parentWidth || 0, [parentWidth]);
  const innerWidth = useMemo(() => width - padding.left, [width]);
  const xDomain = useMemo(() => [filters.start.toDate(), filters.end.toDate()], [filters.end, filters.start]);
  const xScale = useMemo(() => scaleTime({ domain: xDomain, range: [0, innerWidth] }), [innerWidth, xDomain]);
  const yMax = useMemo(() => Math.max(...report.data.map((d) => d.pageViewCount || 0), 10), [report]);
  const yDomain = useMemo(() => [0, yMax], [yMax]);
  const yScale = useMemo(() => scaleLinear({ domain: yDomain, range: [innerHeight, 0] }), [innerHeight, yDomain]);
  const chartData = useMemo<Array<ChartDatum>>(() => report.data.map((d) => ({
    ...d,
    x: xScale(d.dateTimeDate),
    y: d.pageViewCount === null ? null : yScale(d.pageViewCount),
  })), [report, xScale, yScale]);
  const averageY = useMemo(() => report.averagePageViewCount !== null ? yScale(report.averagePageViewCount) : null, [report, yScale]);
  const { hideTooltip, showTooltip: rawShowTooltip, tooltipData, tooltipLeft, tooltipOpen, tooltipTop } = useTooltip<Tooltip>();

  const showTooltip = useCallback((event: EventType) => {
    const svgLocalPoint = localPoint(event);
    if (svgLocalPoint === null) return;

    const bodyLocalPoint = localPoint(document.body, event);
    if (bodyLocalPoint === null) return;

    const datumIndex = xBisect(chartData, xScale.invert(svgLocalPoint.x - padding.left));
    const datum = chartData[datumIndex];

    if (datum.pageViewCount === null) {
      hideTooltip();

      return;
    }

    rawShowTooltip({
      tooltipData: {
        datum,
        end: datum.dateTimeDayjs.add(report.intervalSeconds, "second"),
        start: datum.dateTimeDayjs,
      },
      tooltipLeft: bodyLocalPoint.x,
      tooltipTop: bodyLocalPoint.y,
    });
  }, [chartData, hideTooltip, rawShowTooltip, report, xScale]);

  return (
    <div className="flex-fill" ref={parentRef}>
      {height > 0 && width > 0 ? (
        <svg {...props} className={classNames("d-block", className)} height={height} width={width}>
          <Group left={padding.left} top={padding.top}>
            <AxisLeft
              axisLineClassName="stroke-0"
              scale={yScale}
              tickStroke="transparent"
              tickValues={yDomain}
            />

            <AxisBottom
              axisLineClassName="stroke-0"
              scale={xScale}
              tickComponent={TimeChartAxisBottomTick}
              tickFormat={timeChartAxisBottomTickFormat}
              tickLabelProps={timeChartAxisBottomTickLabelProps}
              tickStroke="transparent"
              tickValues={xDomain}
              top={innerHeight}
            />

            <GridRows
              height={innerHeight}
              left={0}
              scale={yScale}
              tickValues={yDomain}
              top={0}
              width={innerWidth}
            />

            {averageY !== null ? (
              <Group>
                <Line
                  className={styles.averageLine}
                  from={{ x: 0, y: averageY }}
                  to={{ x: innerWidth, y: averageY }}
                />

                <text className="fs-9" dy="1em" textAnchor="end" x={innerWidth} y={averageY}>
                  {`Average: ${report.averagePageViewCount} page views`}
                </text>
              </Group>
            ) : null}

            <LinePath
              className="stroke-2 stroke-current-color text-primary"
              data={chartData}
              defined={(d) => d.pageViewCount !== null}
              x={(d) => d.x}
              y={(d) => d.y || 0}
            />

            {tooltipOpen && tooltipData !== undefined ? (
              <Group>
                <Line
                  className={styles.crossHairLine}
                  from={{ x: tooltipData.datum.x, y: 0 }}
                  to={{ x: tooltipData.datum.x, y: innerHeight }}
                />

                {tooltipData.datum.y !== null ? (
                  <Circle
                    className={styles.crossHairCircle}
                    cx={tooltipData.datum.x}
                    cy={tooltipData.datum.y}
                    r={3}
                  />
                ) : null}
              </Group>
            ) : null}

            <rect
              className="fill-transparent"
              height={innerHeight}
              onMouseLeave={hideTooltip}
              onMouseMove={showTooltip}
              onTouchEnd={hideTooltip}
              onTouchMove={showTooltip}
              width={innerWidth}
              x={0}
              y={0}
            />
          </Group>
        </svg>
      ) : null}

      {tooltipOpen && tooltipData !== undefined ? (
        <ChartTooltip left={tooltipLeft} top={tooltipTop}>
          <div className="align-items-center d-flex flex-row fs-8 gap-4 text-center">
            <div>
              <div>{tooltipData.start.format("HH:mm")}</div>

              <div className="fs-8 fw-medium">{tooltipData.start.format("MMM D")}</div>
            </div>

            <div>&rarr;</div>

            <div>
              <div>{tooltipData.end.format("HH:mm")}</div>

              <div className="fs-8 fw-medium">{tooltipData.end.format("MMM D")}</div>
            </div>
          </div>

          <div className="fw-medium mt-1 text-center">{`${tooltipData.datum.pageViewCount} page views`}</div>
        </ChartTooltip>
      ) : null}
    </div>
  );
}

export default function PageViews({ ...props }: PageViewsProps) {
  const { data: report } = useSitePageViewReport();

  return report === undefined ? (
    <div className="align-items-center d-flex flex-fill justify-content-center">
      <ActivityIndicator />
    </div>
  ) : (
    <InnerPageViews {...props} report={report} />
  );
}
