import { AxisLeft, AxisTop, TickFormatter } from "@visx/axis";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { withParentSizeModern } from "@visx/responsive";
import { scaleBand } from "@visx/scale";
import { Bar } from "@visx/shape";
import { useTooltip } from "@visx/tooltip";
import chroma from "chroma-js";
import { ScaleBand } from "d3-scale";
import { range } from "lodash";
import React, { useCallback, useMemo } from "react";
import { useSiteVisitorTrendsReport } from "../../../hooks";
import { ChartTooltip } from "../../ChartTooltip";

type BaseChartProps = {
  parentHeight?: number;
  parentWidth?: number;
};

type State = {
  data: Array<StateDatum>;
  height: number;
  innerHeight: number;
  innerWidth: number;
  width: number;
  xDomain: Array<number>;
  xScale: ScaleBand<number>;
  xTickValues: Array<number>;
  yDomain: Array<number>;
  yScale: ScaleBand<number>;
  yTickValues: Array<number>;
};

type StateDatum = {
  color: string;
  datum: HydratedSiteVisitorTrendsDatum;
  handleMouseEvent?: (event: React.MouseEvent<SVGPathElement> | React.TouchEvent<SVGPathElement>) => void;
  height: number;
  key: string;
  width: number;
  x: number;
  y: number;
};

type Tooltip = {
  datum: HydratedSiteVisitorTrendsDatum;
};

const padding = { bottom: 24, left: 24, top: 16 };

export function BaseChart({ parentHeight, parentWidth }: BaseChartProps) {
  const { hideTooltip, showTooltip: rawShowTooltip, tooltipData, tooltipLeft, tooltipOpen, tooltipTop } = useTooltip<Tooltip>();
  const { data: rawData } = useSiteVisitorTrendsReport();

  const state = useMemo<State | null>(() => {
    if (rawData === undefined || parentHeight === undefined || parentWidth === undefined) {
      return null;
    }

    const height = parentHeight;
    const width = parentWidth;

    const innerHeight = height - padding.top - padding.bottom;
    const innerWidth = width - padding.left;

    const xDomain = range(0, 24, 2);
    const xTickValues = range(0, 24, 4);
    const xScale = scaleBand({ domain: xDomain, padding: 0.3, range: [0, innerWidth] });

    const yDomain = range(1, 8);
    const yTickValues = yDomain;
    const yScale = scaleBand({ domain: yDomain, padding: 0.3, range: [0, innerHeight] });

    const colorScale = chroma
      .scale([
        "#e9ecef",
        "#cfe2ff",
        "#9ec5fe",
        "#6ea8fe",
        "#3d8bfd",
        "#0d6efd",
      ])
      .domain([0, Math.max(...rawData.map((d) => d.visitorCount))]);

    const data = rawData.map((datum): StateDatum => {
      const key = `${datum.day}-${datum.hour}`;

      const x = xScale(datum.hour) || 0;
      const y = yScale(datum.day) || 0;

      let handleMouseEvent: StateDatum["handleMouseEvent"] = undefined;

      if (datum.visitorCount > 0) {
        handleMouseEvent = (event) => {
          const coords = localPoint(document.body, event);

          if (coords === null) return;

          rawShowTooltip({
            tooltipData: {
              datum: datum,
            },
            tooltipLeft: coords.x,
            tooltipTop: coords.y,
          });
        };
      }

      return {
        color: colorScale(datum.visitorCount).hex(),
        datum,
        handleMouseEvent,
        height: yScale.bandwidth(),
        key,
        width: xScale.bandwidth(),
        x,
        y,
      };
    });

    return {
      data,
      height,
      innerHeight,
      innerWidth,
      width,
      xDomain,
      xScale,
      xTickValues,
      yDomain,
      yScale,
      yTickValues,
    };
  }, [parentHeight, parentWidth, rawData, rawShowTooltip]);

  const axisLeftTickFormat = useCallback<TickFormatter<number>>((value) => {
    return ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][value - 1];
  }, []);

  const axisTopTickFormat = useCallback<TickFormatter<number>>((value) => {
    return `${value % 12 || 12} ${value < 12 ? "AM" : "PM"}`;
  }, []);

  return state === null ? null : (
    <>
      <svg className="d-block" height={state.height} width={state.width}>
        <Group left={padding.left} top={padding.top}>
          <AxisTop hideAxisLine hideTicks scale={state.xScale} tickFormat={axisTopTickFormat} tickValues={state.xTickValues} top={12} />

          <AxisLeft hideAxisLine hideTicks left={8} scale={state.yScale} tickFormat={axisLeftTickFormat} tickValues={state.yTickValues} />

          {state.data.map((d) => (
            <Bar
              fill={d.color}
              height={d.height}
              key={d.key}
              onMouseLeave={hideTooltip}
              onMouseMove={d.handleMouseEvent}
              onTouchEnd={hideTooltip}
              onTouchMove={d.handleMouseEvent}
              rx={2}
              ry={2}
              width={d.width}
              x={d.x}
              y={d.y}
            />
          ))}
        </Group>
      </svg>

      {tooltipOpen && tooltipData !== undefined ? (
        <ChartTooltip left={tooltipLeft} top={tooltipTop}>
          <div className="text-center">
            <div className="fw-medium">{tooltipData.datum.dayDisplay}</div>

            <div className="align-items-center d-flex flex-row gap-2 mt-1 justify-content-center">
              <div>{tooltipData.datum.hourStartDisplay}</div>

              <div>&rarr;</div>

              <div>{tooltipData.datum.hourEndDisplay}</div>
            </div>

            <div className="mt-1">{`${tooltipData.datum.visitorCount} visitors`}</div>
          </div>
        </ChartTooltip>
      ) : null}
    </>
  );
}

export const Chart = withParentSizeModern(BaseChart);