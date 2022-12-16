import { AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";
import { Group } from "@visx/group";
import { withParentSizeModern } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { useTooltip } from "@visx/tooltip";
import { ScaleBand, ScaleLinear } from "d3-scale";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useMemo } from "react";
import { SiteReportsFiltersContext } from "../../../../../contexts";
import { useSiteOperatingSystemNameReport } from "../../../../../hooks";
import { ChartTooltip } from "../../../../ChartTooltip";

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
  xDomain: [number, number];
  xScale: ScaleLinear<number, number>;
  yDomain: Array<string>;
  yScale: ScaleBand<string>;
};

type StateDatum = {
  datum: HydratedSiteOperatingSystemNameDatum;
  height: number;
  width: number;
  x: number;
  y: number;
};

type Tooltip = {
  datum: HydratedSiteOperatingSystemNameDatum;
};

const padding = { bottom: 10, left: 58, right: 10, top: 10 };

export function BaseChart({ parentHeight, parentWidth }: BaseChartProps) {
  const router = useRouter();
  const { hideTooltip, showTooltip: rawShowTooltip, tooltipData, tooltipLeft, tooltipOpen, tooltipTop } = useTooltip<Tooltip>();
  const { end, start } = useContext(SiteReportsFiltersContext);
  const { data: rawData } = useSiteOperatingSystemNameReport();

  const handleRectClick = useCallback(async (d: HydratedSiteOperatingSystemNameDatum) => {
    await router.push({
      pathname: router.pathname,
      query: { ...router.query, operatingSystemName: d.operatingSystemName },
    }, undefined, { scroll: false });
  }, [router]);

  const state = useMemo<State | null>(() => {
    if (rawData === undefined || !parentHeight || !parentWidth) {
      return null;
    }

    const slicedData = rawData[0].data.slice(0, 5);

    const height = parentHeight;
    const width = parentWidth;

    const innerHeight = height - padding.top - padding.bottom;
    const innerWidth = width - padding.left - padding.right;

    const xDomain: State["xDomain"] = [0, Math.max(...slicedData.map((d) => d.visitorCount))];
    const xScale: State["xScale"] = scaleLinear({ domain: xDomain, range: [0, innerWidth] });

    const yDomain: State["yDomain"] = slicedData.map((d) => d.operatingSystemName);
    const yScale: State["yScale"] = scaleBand({ domain: yDomain, padding: 0.4, range: [0, innerHeight] });

    const data = slicedData.map((d) => {
      return {
        datum: d,
        height: yScale.bandwidth(),
        width: xScale(d.visitorCount),
        x: 0,
        y: yScale(d.operatingSystemName) || 0,
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
      yDomain,
      yScale,
    };
  }, [rawData, parentHeight, parentWidth]);

  const showTooltip = useCallback((
    event: React.MouseEvent<SVGRectElement, MouseEvent> | React.TouchEvent<SVGRectElement>,
    datum: HydratedSiteOperatingSystemNameDatum,
  ) => {
    if (state === null) return;

    const bodyLocalPoint = localPoint(document.body, event);
    if (bodyLocalPoint === null) return;

    rawShowTooltip({
      tooltipData: {
        datum,
      },
      tooltipLeft: bodyLocalPoint.x,
      tooltipTop: bodyLocalPoint.y,
    });
  }, [rawShowTooltip, state]);

  return state === null ? null : (
    <>
      <svg className="d-block" height={state.height} width={state.width}>
        <Group top={padding.top}>
          <Group left={padding.left}>
            <AxisLeft
              hideTicks
              scale={state.yScale}
              stroke={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-300")}
            />

            {state.data.map((d) => (
              <Bar
                fill={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-primary")}
                height={d.height}
                key={d.datum.operatingSystemName}
                width={d.width}
                x={d.x}
                y={d.y}
              />
            ))}
          </Group>

          <Group>
            {state.data.map((d) => (
              <rect
                className="cursor-pointer"
                fill="transparent"
                height={state.yScale.bandwidth()}
                key={d.datum.operatingSystemName}
                onClick={() => handleRectClick(d.datum)}
                onMouseLeave={hideTooltip}
                onMouseMove={(event) => showTooltip(event, d.datum)}
                onTouchEnd={hideTooltip}
                onTouchMove={(event) => showTooltip(event, d.datum)}
                width={state.width}
                x={0}
                y={d.y}
              />
            ))}
          </Group>
        </Group>
      </svg>

      {tooltipOpen && tooltipData !== undefined ? (
        <ChartTooltip left={tooltipLeft} top={tooltipTop}>
          <div className="align-items-center d-flex flex-row gap-2 justify-content-center text-center">
            <div>
              <div>{start.format("HH:mm")}</div>

              <div className="fs-xxs">{start.format("MMM D")}</div>
            </div>

            <div>&rarr;</div>

            <div>
              <div>{end.format("HH:mm")}</div>

              <div className="fs-xxs">{end.format("MMM D")}</div>
            </div>
          </div>

          <div className="mt-2 text-center">
            <div className="fs-xs fw-medium">{tooltipData.datum.operatingSystemName}</div>

            <div className="mt-1">{`${tooltipData.datum.visitorCount} visitors (${tooltipData.datum.visitorPercentageDisplay})`}</div>
          </div>
        </ChartTooltip>
      ) : null}
    </>
  );
}

export const Chart = withParentSizeModern(BaseChart);
