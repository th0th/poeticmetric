import { localPoint } from "@visx/event";
import { withParentSizeModern } from "@visx/responsive";
import { useTooltip } from "@visx/tooltip";
import chroma from "chroma-js";
import { useRouter } from "next/router";
import React, { useCallback, useMemo } from "react";
import { useSiteCountryReport } from "../../../hooks";
import { ChartTooltip } from "../../ChartTooltip";
import { map } from "./map";

type State = {
  colorScale: chroma.Scale<chroma.Color>;
  mappedData: Record<string, HydratedSiteCountryDatum>;
};

type Tooltip = {
  datum: HydratedSiteCountryDatum;
};

const padding = { bottom: 24, left: 90, top: 8 };

export type LanguageProps = Overwrite<Omit<React.PropsWithoutRef<JSX.IntrinsicElements["svg"]>, "children">, {
  debounceTime?: number;
  enableDebounceLeadingCall?: boolean;
  parentHeight?: number;
  parentWidth?: number;
}>;

function BaseCountry({ debounceTime: _, enableDebounceLeadingCall: __, parentHeight, parentWidth }: LanguageProps) {
  const router = useRouter();
  const { hydratedData: report } = useSiteCountryReport();
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

    const mappedData: Record<string, HydratedSiteCountryDatum> = {};

    report.forEach((d) => {
      mappedData[d.countryIsoCode] = d;
    });

    return {
      colorScale: chroma
        .scale([
          "#EBF8FF",
          "#BEE3F8",
          "#90CDF4",
          "#63B3ED",
          "#4299E1",
          "#3182CE",
          "#3182CE",
          "#2B6CB0",
          "#2C5282",
          "#2A4365",
          "#1A365D",
        ])
        .domain(
          [0, Math.max(...report.map((d) => d.visitorCount))],
        ),
      mappedData,
      report,
    };
  }, [report]);

  const handlePathClick = useCallback(async (d: HydratedSiteCountryDatum) => {
    await router.push({
      pathname: router.pathname,
      query: { ...router.query, countryIsoCode: d.countryIsoCode },
    });
  }, [router]);

  const showTooltip = useCallback(
    (
      event: React.MouseEvent<SVGPathElement, MouseEvent> | React.TouchEvent<SVGPathElement>,
      datum: HydratedSiteCountryDatum,
    ) => {
      const coords = localPoint(document.body, event);
      if (coords === null) return;

      rawShowTooltip({
        tooltipData: {
          datum,
        },
        tooltipLeft: coords.x,
        tooltipTop: coords.y,
      });
    }, [rawShowTooltip],
  );

  return state === null ? null : (
    <>
      <svg className="d-block" viewBox="0 0 1008.27 650.94">
        {map.map((d) => {
          const m = state.mappedData[d.isoCode];

          return (
            <React.Fragment key={d.isoCode}>
              <path
                // className={classNames(m === undefined ? null : styles.clickablePath)}
                d={d.d}
                fill={m === undefined ? "#E5E7EB" : state.colorScale(m.visitorCount).hex()}
                onClick={() => handlePathClick(m)}
                onMouseMove={(event) => (m === undefined ? null : showTooltip(event, m))}
                onMouseOut={hideTooltip}
                onTouchEnd={hideTooltip}
                onTouchMove={(event) => (m === undefined ? null : showTooltip(event, m))}
                stroke="#DADCE0"
              />
            </React.Fragment>
          );
        })}
      </svg>

      {tooltipOpen && tooltipData !== undefined ? (
        <ChartTooltip left={tooltipLeft} top={tooltipTop}>
          <div className="text-center">
            <div className="fss-2 fw-medium">{tooltipData.datum.country}</div>

            <div className="mt-1">{`${tooltipData.datum.visitorCount} visitors (${tooltipData.datum.visitorPercentageDisplay})`}</div>
          </div>
        </ChartTooltip>
      ) : null}
    </>
  );
}

export const Country = withParentSizeModern(BaseCountry);
