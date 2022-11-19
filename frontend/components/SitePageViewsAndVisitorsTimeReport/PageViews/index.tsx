import { AxisBottom, AxisLeft, TickFormatter, TickLabelProps } from "@visx/axis";
import { localPoint } from "@visx/event";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { withParentSizeModern } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { Circle, Line, LinePath } from "@visx/shape";
import { useTooltip } from "@visx/tooltip";
import classNames from "classnames";
import { bisector } from "d3-array";
import { NumberValue, ScaleLinear, ScaleTime } from "d3-scale";
import dayjs from "dayjs";
import React, { useCallback, useContext, useMemo } from "react";
import { SiteReportsFiltersContext } from "../../../contexts";
import { useSitePageViewReport } from "../../../hooks";
import { ChartTooltip } from "../../ChartTooltip";
import { AxisBottomTick } from "./AxisBottomTick";

export type PageViewsProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["svg"]>, "children">, {
  debounceTime?: number;
  enableDebounceLeadingCall?: boolean;
  parentHeight?: number;
  parentWidth?: number;
}>;

type State = {
  averagePageViewCount: number;
  averagePageViewCountY: number;
  data: Array<StateDatum>;
  height: number;
  innerHeight: number;
  innerWidth: number;
  interval: SitePageViewsTimeInterval;
  width: number;
  xDomain: [Date, Date];
  xScale: ScaleTime<number, number>;
  yDomain: [number, number];
  yScale: ScaleLinear<number, number>;
};

type StateDatum = {
  datum: HydratedSitePageViewsTimeDatum;
  x: number;
  y: number;
};

type Tooltip = {
  endDayjs: dayjs.Dayjs;
  startDayjs: dayjs.Dayjs;
  stateDatum: StateDatum;
};

const padding = { bottom: 24, left: 40, top: 8 };

const xBisect = bisector((d: StateDatum) => d.datum.dateTimeDate).center;

function BasePageViews({ className, debounceTime: _, enableDebounceLeadingCall: __, parentHeight, parentWidth, ...props }: PageViewsProps) {
  const { hideTooltip, showTooltip: rawShowTooltip, tooltipData, tooltipLeft, tooltipOpen, tooltipTop } = useTooltip<Tooltip>();
  const { end, start } = useContext(SiteReportsFiltersContext);
  const { hydratedData: report } = useSitePageViewReport();

  const state = useMemo<State | null>(() => {
    if (report === undefined || parentWidth === undefined || parentHeight === undefined) {
      return null;
    }

    const height = parentHeight;
    const width = parentWidth;

    const innerWidth = width - padding.left;
    const innerHeight = height - padding.top - padding.bottom;

    const xDomain: State["xDomain"] = [start.toDate(), end.toDate()];
    const xScale = scaleTime({
      domain: xDomain,
      range: [0, innerWidth],
    });

    const yMax = Math.max(...report.hydratedData.map((d) => d.pageViewCount || 10));
    const yDomain: State["yDomain"] = [0, yMax];
    const yScale = scaleLinear<number>({
      domain: yDomain,
      range: [innerHeight, 0],
    });

    const data: State["data"] = report.hydratedData.map((datum) => ({
      datum,
      x: xScale(datum.dateTimeDate),
      y: yScale(datum.pageViewCount),
    }));

    const { averagePageViewCount, interval } = report;
    const averagePageViewCountY = yScale(averagePageViewCount);

    return {
      averagePageViewCount,
      averagePageViewCountY,
      data,
      height,
      innerHeight,
      innerWidth,
      interval,
      width,
      xDomain,
      xScale,
      yDomain,
      yScale,
    };
  }, [end, parentHeight, parentWidth, report, start]);

  const axisBottomTickFormat = useCallback<TickFormatter<Date | NumberValue>>((value) => {
    return value instanceof Date ? value.toISOString() : undefined;
  }, []);

  const axisBottomTickLabelProps = useCallback<TickLabelProps<Date | NumberValue>>((value, index) => ({
    textAnchor: index === 0 ? "start" : "end",
  }), []);

  const showTooltip = useCallback((event: React.MouseEvent<SVGRectElement, MouseEvent> | React.TouchEvent<SVGRectElement>) => {
    if (state === null) return;

    const svgLocalPoint = localPoint(event);
    if (svgLocalPoint === null) return;

    const bodyLocalPoint = localPoint(document.body, event);
    if (bodyLocalPoint === null) return;

    const datumIndex = xBisect(state.data, state.xScale.invert(svgLocalPoint.x - padding.left));
    const datum = state.data[datumIndex];

    if (datum.datum.pageViewCount === null) {
      hideTooltip();

      return;
    }

    rawShowTooltip({
      tooltipData: {
        endDayjs: datum.datum.dateTimeDayjs.add(state.interval.factor, state.interval.unit),
        startDayjs: datum.datum.dateTimeDayjs,
        stateDatum: datum,
      },
      tooltipLeft: bodyLocalPoint.x,
      tooltipTop: bodyLocalPoint.y,
    });
  }, [hideTooltip, rawShowTooltip, state]);

  return state === null ? null : (
    <>
      <svg {...props} className={classNames("d-block", className)} height={state.height} width={state.width}>
        <Group left={padding.left} top={padding.top}>
          <AxisLeft
            scale={state.yScale}
            strokeWidth={0}
            tickLength={2}
            tickStroke="transparent"
            tickValues={state.yDomain}
          />

          <AxisBottom
            scale={state.xScale}
            strokeWidth={0}
            tickComponent={AxisBottomTick}
            tickFormat={axisBottomTickFormat}
            tickLabelProps={axisBottomTickLabelProps}
            tickLength={2}
            tickStroke="transparent"
            tickValues={state.xDomain}
            top={state.innerHeight}
          />

          <GridRows
            height={state.innerHeight}
            left={0}
            scale={state.yScale}
            stroke={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-300")}
            tickValues={state.yDomain}
            top={0}
            width={state.innerWidth}
          />

          <Group>
            <Line
              from={{ x: 0, y: state.averagePageViewCountY }}
              stroke={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-300")}
              strokeDasharray="8,4"
              to={{ x: state.innerWidth, y: state.averagePageViewCountY }}
            />

            <text
              className="fss-3 text-muted"
              dy="1em"
              textAnchor="end"
              x={state.innerWidth}
              y={state.averagePageViewCountY}
            >
              {`Average: ${state.averagePageViewCount} page views`}
            </text>
          </Group>

          <LinePath
            data={state.data}
            defined={(d) => d.y !== null}
            stroke={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-primary")}
            strokeWidth={2}
            x={(d) => d.x}
            y={(d) => d.y || 1}
          />

          {tooltipOpen && tooltipData !== undefined ? (
            <Group>
              <Line
                from={{ x: tooltipData.stateDatum.x, y: 0 }}
                stroke={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-300")}
                strokeDasharray="4,4"
                to={{ x: tooltipData.stateDatum.x, y: state.innerHeight }}
              />

              <Circle
                cx={tooltipData.stateDatum.x}
                cy={tooltipData.stateDatum.y}
                fill={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-white")}
                r={4}
                stroke={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-primary")}
              />
            </Group>
          ) : null}

          <rect
            fill="transparent"
            height={state.innerHeight}
            onMouseLeave={hideTooltip}
            onMouseMove={showTooltip}
            onTouchEnd={hideTooltip}
            onTouchMove={showTooltip}
            width={state.width}
            x={0}
            y={0}
          />
        </Group>
      </svg>

      {tooltipOpen && tooltipData !== undefined ? (
        <ChartTooltip left={tooltipLeft} top={tooltipTop}>
          <div className="align-items-center d-flex flex-row gap-2 text-center">
            <div>
              <div>{tooltipData.startDayjs.format("HH:mm")}</div>

              <div className="fss-3">{tooltipData.startDayjs.format("MMM D")}</div>
            </div>

            <div>&rarr;</div>

            <div>
              <div>{tooltipData.endDayjs.format("HH:mm")}</div>

              <div className="fss-3">{tooltipData.endDayjs.format("MMM D")}</div>
            </div>
          </div>

          <div className="fw-medium mt-1 text-center">{`${tooltipData.stateDatum.datum.pageViewCount} page views`}</div>
        </ChartTooltip>
      ) : null}
    </>
  );
}

export const PageViews = withParentSizeModern(BasePageViews);
