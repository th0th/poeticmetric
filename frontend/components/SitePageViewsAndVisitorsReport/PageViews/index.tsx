import { AxisBottom, AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { ParentSize } from "@visx/responsive";
import { scaleLinear, scaleTime } from "@visx/scale";
import { Circle, Line, LinePath } from "@visx/shape";
import { useTooltip } from "@visx/tooltip";
import { bisector } from "d3-array";
import { ScaleTime } from "d3-scale";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import { Spinner } from "react-bootstrap";
import { useSitePageViewsTimeReport } from "../../../hooks";
import { AxisBottomTick } from "./AxisBottomTick";

type State = {
  averagePageViewCount: number,
  data: Array<HydratedSitePageViewsTimeDatum>,
  intervalSeconds: number,
  maxPageViewCount: number,
  xTickValues: Array<Date>,
  yTickValues: Array<number>,
};

type Tooltip = {
  dateTimeEnd: dayjs.Dayjs,
  dateTimeStart: dayjs.Dayjs,
  datum: HydratedSitePageViewsTimeDatum,
  pageViewCount: number,
};

const padding = { bottom: 34, left: 40, right: 10, top: 20 };

function xValue(d: HydratedSitePageViewsTimeDatum): Date {
  return d.dateTimeDayjs.toDate();
}

function yValue(d: HydratedSitePageViewsTimeDatum): number {
  return d.pageViewCount;
}

const xBisect = bisector(xValue).center;

export function PageViews() {
  const { hydratedData: report } = useSitePageViewsTimeReport();

  const {
    hideTooltip,
    showTooltip: rawShowTooltip,
    tooltipData,
    tooltipLeft,
    tooltipOpen,
    tooltipTop,
  } = useTooltip<Tooltip>();

  const state = useMemo<State | null>(() => {
    if (report === undefined) {
      return null;
    }

    const maxPageViewCount = Math.max(10, ...report.hydratedData.map(yValue).filter((c) => c !== null) as Array<number>);

    return {
      averagePageViewCount: report.averagePageViewCount,
      data: report.hydratedData,
      intervalSeconds: report?.intervalSeconds,
      maxPageViewCount,
      xTickValues: [
        report.hydratedData[0].dateTimeDayjs.toDate(),
        report.hydratedData[report.hydratedData.length - 1].dateTimeDayjs.toDate(),
      ],
      yTickValues: [0, maxPageViewCount],
    };
  }, [report]);

  function showTooltip(
    event: React.MouseEvent<SVGRectElement, MouseEvent> | React.TouchEvent<SVGRectElement>,
    xScale: ScaleTime<number, number>,
  ): void {
    if (state === null) {
      return;
    }

    const svgLocalPoint = localPoint(event);
    if (svgLocalPoint === null) return;

    const bodyLocalPoint = localPoint(document.body, event);
    if (bodyLocalPoint === null) return;

    const datumIndex = xBisect(state.data, xScale.invert(svgLocalPoint.x - padding.left));
    const datum = state.data[datumIndex];

    if (datum.pageViewCount === null) return;

    rawShowTooltip({
      tooltipData: {
        dateTimeEnd: datum.dateTimeDayjs.add(state.intervalSeconds, "second"),
        dateTimeStart: datum.dateTimeDayjs,
        datum,
        pageViewCount: datum.pageViewCount,
      },
      tooltipLeft: bodyLocalPoint.x,
      tooltipTop: bodyLocalPoint.y,
    });
  }

  return state === null ? (
    <Spinner animation="border" />
  ) : (
    <ParentSize>
      {({ height, width }) => {
        const innerWidth = width - padding.left - padding.right;
        const innerHeight = height - padding.top - padding.bottom;

        if (innerHeight <= 0 || innerWidth <= 0) {
          return null;
        }

        const xScale = scaleTime({
          domain: [state.xTickValues[0], state.xTickValues[1]],
          range: [0, innerWidth],
        });

        const yScale = scaleLinear({
          domain: [0, state.maxPageViewCount],
          range: [innerHeight, 0],
        });

        return (
          <svg className="d-block" height={height} width={width}>
            <Group left={padding.left} top={padding.top}>
              <AxisLeft
                hideAxisLine
                hideTicks
                scale={yScale}
                tickFormat={(d) => parseInt(`${d}`).toString()}
                tickLabelProps={(value, index) => ({
                  // className: styles.yTick,
                  textAnchor: index === 0 ? "start" : "end",
                })}
                tickValues={state.yTickValues}
              />

              <AxisBottom
                hideAxisLine
                hideTicks
                scale={xScale}
                tickComponent={AxisBottomTick}
                tickFormat={(d) => {
                  if (d instanceof Date) {
                    return d.toISOString();
                  }

                  return d.toString();
                }}
                tickLabelProps={(value, index) => ({
                  textAnchor: index === 0 ? "start" : "end",
                })}
                tickValues={state.xTickValues}
                top={innerHeight}
              />

              <GridRows
                height={innerHeight}
                scale={yScale}
                stroke="#000000"
                strokeOpacity={0.1}
                tickValues={state.yTickValues}
                width={innerWidth}
              />

              <Group>
                <Line
                  // className={styles.averageLine}
                  from={{ x: 0, y: yScale(state.averagePageViewCount) }}
                  strokeDasharray="4,4"
                  strokeWidth={1}
                  to={{ x: innerWidth, y: yScale(state.averagePageViewCount) }}
                />

                <text
                  // className={styles.averageText}
                  dy="1em"
                  textAnchor="end"
                  x={innerWidth}
                  y={yScale(state.averagePageViewCount)}
                >
                  {`Average: ${state.averagePageViewCount} page views`}
                </text>
              </Group>

              <LinePath
                data={state.data}
                defined={(d) => yValue(d) !== null}
                stroke="#10B981"
                strokeWidth={2}
                x={(d) => xScale(xValue(d))}
                y={(d) => yScale(yValue(d) as number)}
              />

              {tooltipOpen && tooltipData !== undefined && tooltipData.pageViewCount !== null ? (
                <Group>
                  <Circle
                    cx={xScale(tooltipData.dateTimeStart)}
                    cy={yScale(tooltipData.pageViewCount)}
                    fill="#FFF"
                    height={10}
                    r={3}
                    stroke="#10B981"
                    strokeWidth={2}
                  />

                  <Line
                    from={{ x: xScale(tooltipData.dateTimeStart.toDate()), y: 0 }}
                    stroke="#CCC"
                    strokeDasharray="2,2"
                    strokeWidth={1}
                    to={{ x: xScale(tooltipData.dateTimeStart.toDate()), y: innerHeight }}
                  />
                </Group>
              ) : null}

              <rect
                fill="transparent"
                height={innerHeight}
                onMouseLeave={hideTooltip}
                onMouseMove={(event) => showTooltip(event, xScale)}
                onTouchEnd={hideTooltip}
                onTouchMove={(event) => showTooltip(event, xScale)}
                width={innerWidth}
                x={0}
                y={0}
              />
            </Group>
          </svg>
        );
      }}
    </ParentSize>
  );
}
