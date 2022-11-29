import { AxisLeft } from "@visx/axis";
import { localPoint } from "@visx/event";
import { GridColumns } from "@visx/grid";
import { Group } from "@visx/group";
import { withParentSizeModern } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar } from "@visx/shape";
import { useTooltip } from "@visx/tooltip";
import { ScaleBand, ScaleLinear } from "d3-scale";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useMemo } from "react";
import { SiteReportsFiltersContext } from "../../../contexts";
import { useSiteLanguageReport } from "../../../hooks";
import { ChartTooltip } from "../../ChartTooltip";
import { AxisLeftTick } from "./AxisLeftTick";

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
  datum: HydratedSiteLanguageReportDatum;
  height: number;
  width: number;
  x: number;
  y: number;
};

type Tooltip = {
  datum: HydratedSiteLanguageReportDatum;
};

const padding = { bottom: 24, left: 90, top: 8 };

export type LanguageProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["svg"]>, "children">, {
  debounceTime?: number;
  enableDebounceLeadingCall?: boolean;
  parentHeight?: number;
  parentWidth?: number;
}>;

function BaseLanguage({ debounceTime: _, enableDebounceLeadingCall: __, parentHeight, parentWidth }: LanguageProps) {
  const router = useRouter();
  const { hideTooltip, showTooltip: rawShowTooltip, tooltipData, tooltipLeft, tooltipOpen, tooltipTop } = useTooltip<Tooltip>();
  const { end, start } = useContext(SiteReportsFiltersContext);
  const { hydratedData: report } = useSiteLanguageReport();

  const state = useMemo<State | null>(() => {
    if (report === undefined || parentWidth === undefined || parentHeight == undefined) {
      return null;
    }

    const reportData = report.hydratedData.slice(0, 5);

    const width = parentWidth;
    const height = parentHeight;

    const innerWidth = width - padding.left;
    const innerHeight = height - padding.top - padding.bottom;

    const xDomain: State["xDomain"] = [0, Math.max(...reportData.map((d) => d.visitorCount))];
    const xScale = scaleLinear({ domain: xDomain, range: [0, innerWidth] });

    const yDomain = reportData.map((d) => d.language);
    const yScale = scaleBand({ domain: yDomain, padding: 0.4, range: [0, innerHeight] });

    const data = reportData.slice(0, 5).map((datum) => ({
      datum,
      height: yScale.bandwidth(),
      width: xScale(datum.visitorCount),
      x: 0,
      y: yScale(datum.language) || 0,
    }));

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
  }, [parentHeight, parentWidth, report]);

  const handleRectClick = useCallback(async (d: HydratedSiteLanguageReportDatum) => {
    await router.push({ pathname: router.pathname, query: { ...router.query, language: d.language } });
  }, [router]);

  const showTooltip = useCallback((
    event: React.MouseEvent<SVGRectElement, MouseEvent> | React.TouchEvent<SVGRectElement>,
    datum: HydratedSiteLanguageReportDatum,
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
              scale={state.yScale}
              stroke={window.getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-300")}
              tickComponent={AxisLeftTick}
              tickLineProps={{
                stroke: window.getComputedStyle(document.documentElement).getPropertyValue("--bs-gray-300"),
              }}
              tickValues={state.yDomain}
            />

            <GridColumns height={state.innerHeight} scale={state.xScale} />

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
          </Group>

          {state.data.map((d) => (
            <rect
              className="cursor-pointer"
              fill="transparent"
              height={d.height}
              key={d.datum.language}
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
      </svg>

      {tooltipOpen && tooltipData !== undefined ? (
        <ChartTooltip left={tooltipLeft} top={tooltipTop}>
          <div className="align-items-center d-flex flex-row gap-2 text-center">
            <div>
              <div>{start.format("HH:mm")}</div>

              <div className="fss-3">{start.format("MMM D")}</div>
            </div>

            <div>&rarr;</div>

            <div>
              <div>{end.format("HH:mm")}</div>

              <div className="fss-3">{end.format("MMM D")}</div>
            </div>
          </div>

          <div className="mt-2 text-center">
            <div className="fss-2 fw-medium">{tooltipData.datum.language}</div>

            <div className="mt-1">{`${tooltipData.datum.visitorCount} visitors (${tooltipData.datum.visitorPercentageDisplay})`}</div>
          </div>
        </ChartTooltip>
      ) : null}
    </>
  );
}

export const Language = withParentSizeModern(BaseLanguage);
