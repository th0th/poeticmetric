import { AxisBottom, AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";
import { EventType } from "@visx/event/lib/types";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { useParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { useTooltip } from "@visx/tooltip";
import classNames from "classnames";
import millify from "millify";
import { JSX, useCallback, useMemo } from "react";
import { useSearchParams } from "wouter";
import ActivityIndicator from "~/components/ActivityIndicator";
import ChartTooltip from "~/components/ChartTooltip";
import useSiteLanguageReport from "~/hooks/api/useSiteLanguageReport";

export type ChartProps = Omit<JSX.IntrinsicElements["svg"], "children">;

type InnerChartProps = Overwrite<ChartProps, {
  data: Array<HydratedSiteLanguageReportDatum>;
}>;

type Tooltip = {
  datum: HydratedSiteLanguageReportDatum;
};

const padding = { bottom: 30, left: 54, top: 8 };

function InnerChart({ className, data, ...props }: InnerChartProps) {
  const [, setSearchParams] = useSearchParams();
  const { height: parentHeight, parentRef, width: parentWidth } = useParentSize();
  const height = useMemo(() => Math.max(parentHeight, 180) || 0, [parentHeight]);
  const innerHeight = useMemo(() => height - padding.top - padding.bottom, [height]);
  const width = useMemo(() => parentWidth || 0, [parentWidth]);
  const innerWidth = useMemo(() => width - padding.left, [width]);
  const xDomain = useMemo(() => data.map((d) => d.language), [data]);
  const xScale = useMemo(() => scaleBand({ domain: xDomain, padding: 0.4, range: [0, innerWidth] }), [innerWidth, xDomain]);
  const yMax = useMemo(() => Math.max(...data.map((d) => d.visitorCount || 0), 10), [data]);
  const yDomain = useMemo(() => [0, yMax], [yMax]);
  const yScale = useMemo(() => scaleLinear({ domain: yDomain, range: [innerHeight, 0] }), [innerHeight, yDomain]);
  const chartData = useMemo(() => data.map((d) => {
    const y = yScale(d.visitorCount);

    return {
      ...d,
      height: innerHeight - y,
      onRectClick: d.language === "Others" ? undefined : () => {
        setSearchParams((s) => {
          s.set("language", d.language);

          return s;
        });
      },
      x: xScale(d.language),
      y,
    };
  }), [data, innerHeight, setSearchParams, xScale, yScale]);
  const barWidth = useMemo(() => xScale.bandwidth(), [xScale]);
  const { hideTooltip, showTooltip: rawShowTooltip, tooltipData, tooltipLeft, tooltipOpen, tooltipTop } = useTooltip<Tooltip>();

  const showTooltip = useCallback((
    event: EventType,
    datum: HydratedSiteLanguageReportDatum,
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
    <>
      <div className="flex-fill" ref={parentRef}>
        {height > 0 && width > 0 ? (
          <svg {...props} className={classNames("d-block", className)} height={height} width={width}>
            <Group left={padding.left} top={padding.top}>
              <AxisLeft
                axisLineClassName="stroke-0"
                hideTicks
                scale={yScale}
                tickFormat={axisLeftTickFormat}
                tickValues={yDomain}
              />

              <AxisBottom
                axisLineClassName="stroke-0"
                scale={xScale}
                tickStroke="transparent"
                tickValues={xDomain}
                top={innerHeight}
              />

              <GridRows height={innerHeight} scale={yScale} width={innerWidth} />

              <Group>
                {chartData.map((d) => (
                  <Bar
                    className="fill-current-color text-primary"
                    height={d.height}
                    key={d.language}
                    width={barWidth}
                    x={d.x}
                    y={d.y}
                  />
                ))}

                <Group>
                  {chartData.map((d) => (
                    <rect
                      className={classNames({ "cursor-pointer": d.onRectClick !== undefined })}
                      fill="transparent"
                      height={innerHeight}
                      key={d.language}
                      onClick={d.onRectClick}
                      onMouseLeave={hideTooltip}
                      onMouseMove={(event) => showTooltip(event, d)}
                      onTouchEnd={hideTooltip}
                      onTouchMove={(event) => showTooltip(event, d)}
                      tabIndex={0}
                      width={barWidth}
                      x={d.x}
                      y={0}
                    />
                  ))}
                </Group>
              </Group>
            </Group>
          </svg>
        ) : null}
      </div>

      {tooltipOpen && tooltipData !== undefined ? (
        <ChartTooltip left={tooltipLeft} top={tooltipTop}>
          <div className="text-center">
            <div className="fs-xs fw-medium">{tooltipData.datum.language}</div>
            <div className="mt-1">{`${tooltipData.datum.visitorCount} visitors (${tooltipData.datum.visitorPercentageDisplay})`}</div>
          </div>
        </ChartTooltip>
      ) : null}
    </>
  );
}

export default function Chart() {
  const { data: report } = useSiteLanguageReport();

  const data = useMemo<Array<HydratedSiteLanguageReportDatum> | null>(() => {
    if (report === undefined) {
      return null;
    }

    const d = report.reduce<Array<HydratedSiteLanguageReportDatum>>((a, v) => [...a, ...v.data], []);

    if (d.length < 6) {
      return d;
    }

    const othersVisitorCount = d.slice(4).reduce((a, v) => a + v.visitorCount, 0);
    const otherVisitorPercentage = 100 - d.slice(0, 4).reduce((a, v) => a + v.visitorPercentage, 0);

    return [
      ...d.slice(0, 4),
      {
        language: "Others",
        visitorCount: othersVisitorCount,
        visitorCountDisplay: millify(othersVisitorCount),
        visitorPercentage: otherVisitorPercentage,
        visitorPercentageDisplay: `${otherVisitorPercentage}%`,
      },
    ];
  }, [report]);

  return data === null ? (
    <div className="align-items-center d-flex flex-fill justify-content-center">
      <ActivityIndicator />
    </div>
  ) : (
    <InnerChart data={data} />
  );
}

export function axisLeftTickFormat(value: number | { valueOf(): number }) {
  const v = typeof value === "number" ? value : value.valueOf();

  return millify(v);
}
