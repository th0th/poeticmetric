import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useSiteUtmMediumReport } from "../../../hooks";

type State = {
  data: HydratedSiteUtmMediumReport;
};

export function Medium() {
  const router = useRouter();
  const { data } = useSiteUtmMediumReport();

  const state = useMemo<State | null>(() => {
    if (data === undefined) {
      return null;
    }

    return {
      data: data.slice(0, 5),
    };
  }, [data]);

  return state === null ? null : (
    <div className="fss-1 lh-lg">
      <div className="d-flex flex-row py-1">
        <div className="flex-grow-1 fw-semibold pe-1">UTM medium</div>

        <div className="fw-semibold ps-1 text-end w-4rem" title="Visitor count">Visitors</div>
      </div>

      {state.data.slice(0, 5).map((d) => (
        <div className="align-items-center d-flex parent-d flex-row lh-lg" key={d.utmMedium}>
          <div className="align-items-center d-flex flex-grow-1 flex-row pe-1 overflow-hidden">
            <Link
              className="text-reset text-decoration-none text-decoration-underline-hover text-truncate"
              href={{ pathname: router.pathname, query: { ...router.query, utmMedium: d.utmMedium } }}
              scroll={false}
              title={d.utmMedium}
            >
              {d.utmMedium}
            </Link>
          </div>

          <div className="ps-1 text-end w-4rem" title={d.visitorPercentageDisplay}>{d.visitorCount}</div>
        </div>
      ))}
    </div>
  );
}
