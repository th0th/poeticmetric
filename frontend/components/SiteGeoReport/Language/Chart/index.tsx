import { AxisBottom } from "@visx/axis";
import { localPoint } from "@visx/event";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { withParentSizeModern } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { useTooltip } from "@visx/tooltip";
import { ScaleBand, ScaleLinear } from "d3-scale";
import { range } from "lodash";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useMemo } from "react";
import { ChartTooltip } from "../../..";
import { SiteReportsFiltersContext } from "../../../../contexts";

export type ChartProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["svg"]>, "children">, {
  data: Array<HydratedSiteLanguageDatum>;
  debounceTime?: number;
  enableDebounceLeadingCall?: boolean;
  parentHeight?: number;
  parentWidth?: number;
}>;

type State = {
  data: Array<StateDatum>;
  height: number;
  innerHeight: number;
  innerWidth: number;
  width: number;
  xDomain: Array<string>;
  xScale: ScaleBand<string>;
  yDomain: [number, number];
  yScale: ScaleLinear<number, number>;
  yTickValues: Array<number>;
};

type StateDatum = {
  datum: HydratedSiteLanguageDatum;
  height: number;
  width: number;
  x: number;
  y: number;
};

type Tooltip = {
  datum: HydratedSiteLanguageDatum;
};

const padding = { bottom: 32, left: 8, top: 8 };

function BaseChart({ data, debounceTime: _, enableDebounceLeadingCall: __, parentHeight, parentWidth }: ChartProps) {
  const router = useRouter();
  const { hideTooltip, showTooltip: rawShowTooltip, tooltipData, tooltipLeft, tooltipOpen, tooltipTop } = useTooltip<Tooltip>();
  const { end, start } = useContext(SiteReportsFiltersContext);

  const state = useMemo<State | null>(() => {
    if (data === undefined || parentWidth === undefined || parentHeight == undefined) {
      return null;
    }

    const ySum = data.reduce((a, d) => a + d.visitorCount, 0);

    const chartData = data.slice(0, 5);

    const width = parentWidth;
    const height = parentHeight;

    const innerWidth = width - padding.left;
    const innerHeight = height - padding.top - padding.bottom;

    const xDomain = chartData.map((d) => d.language);
    const xScale = scaleBand({ domain: xDomain, padding: 0.4, range: [0, innerWidth] });

    const yDomain: State["yDomain"] = [0, Math.max(...chartData.map((d) => d.visitorCount))];
    const yScale = scaleLinear({ domain: yDomain, range: [innerHeight, 0] });
    const yTickValues = range(0, yDomain[1], ySum / 20);

    const stateData = chartData.map((datum) => {
      const y = yScale(datum.visitorCount);
      const height = innerHeight - y;

      return {
        datum,
        height,
        width: xScale.bandwidth(),
        x: xScale(datum.language) || 0,
        y,
      };
    });

    return {
      data: stateData,
      height,
      innerHeight,
      innerWidth,
      width,
      xDomain,
      xScale,
      yDomain,
      yScale,
      yTickValues,
    };
  }, [parentHeight, parentWidth, data]);

  const handleRectClick = useCallback(async (d: HydratedSiteLanguageDatum) => {
    await router.push({ pathname: router.pathname, query: { ...router.query, language: d.language } }, undefined, { scroll: false });
  }, [router]);

  const showTooltip = useCallback((
    event: React.MouseEvent<SVGRectElement, MouseEvent> | React.TouchEvent<SVGRectElement>,
    datum: HydratedSiteLanguageDatum,
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
        <Group left={padding.left} top={padding.top}>
          <AxisBottom
            hideTicks
            scale={state.xScale}
            stroke={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-300")}
            tickValues={state.xDomain}
            top={state.innerHeight}
          />

          <GridRows height={state.innerHeight} scale={state.yScale} tickValues={state.yTickValues} width={state.innerWidth} />

          {state.data.map((d) => (
            <Bar
              fill={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-primary")}
              height={d.height}
              key={d.datum.language}
              width={d.width}
              x={d.x}
              y={d.y}
            />
          ))}

          <Group>
            {state.data.map((d) => (
              <rect
                className="cursor-pointer"
                fill="transparent"
                height={state.innerHeight}
                key={d.datum.language}
                onClick={() => handleRectClick(d.datum)}
                onMouseLeave={hideTooltip}
                onMouseMove={(event) => showTooltip(event, d.datum)}
                onTouchEnd={hideTooltip}
                onTouchMove={(event) => showTooltip(event, d.datum)}
                width={d.width}
                x={d.x}
                y={0}
              />
            ))}
          </Group>
        </Group>
      </svg>

      {tooltipOpen && tooltipData !== undefined ? (
        <ChartTooltip left={tooltipLeft} top={tooltipTop}>
          <div className="align-items-center d-flex flex-row gap-2 text-center">
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
            <div className="fs-xs fw-medium">{tooltipData.datum.language}</div>

            <div className="mt-1">{`${tooltipData.datum.visitorCount} visitors (${tooltipData.datum.visitorPercentageDisplay})`}</div>
          </div>
        </ChartTooltip>
      ) : null}
    </>
  );
}

export const Chart = withParentSizeModern(BaseChart);
