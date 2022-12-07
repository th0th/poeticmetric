import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useSiteUtmTermReport } from "../../../hooks";

type State = {
  data: HydratedSiteUtmTermReport;
};

export function Term() {
  const router = useRouter();
  const { data } = useSiteUtmTermReport();

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
        <div className="flex-grow-1 fw-semibold pe-1">UTM term</div>

        <div className="fw-semibold ps-1 text-end w-4rem" title="Visitor count">Visitors</div>
      </div>

      {state.data.slice(0, 5).map((d) => (
        <div className="align-items-center d-flex d-parent flex-row lh-lg" key={d.utmTerm}>
          <div className="align-items-center d-flex flex-grow-1 flex-row pe-1 overflow-hidden">
            <Link
              className="text-reset text-decoration-none text-decoration-underline-hover text-truncate"
              href={{ pathname: router.pathname, query: { ...router.query, utmTerm: d.utmTerm } }}
              scroll={false}
              title={d.utmTerm}
            >
              {d.utmTerm}
            </Link>
          </div>

          <div className="ps-1 text-end w-4rem" title={d.visitorPercentageDisplay}>{d.visitorCount}</div>
        </div>
      ))}
    </div>
  );
}
