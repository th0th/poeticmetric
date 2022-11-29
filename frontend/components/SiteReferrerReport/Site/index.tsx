import Link from "next/link";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useSiteReferrerSiteReport } from "../../../hooks";

type State = {
  data: HydratedSiteReferrerSiteReport;
};

export function Site() {
  const router = useRouter();
  const { data } = useSiteReferrerSiteReport();

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
        <div className="flex-grow-1 fw-semibold pe-1">Site</div>

        <div className="fw-semibold ps-1 text-end w-4rem" title="Visitor count">Visitors</div>
      </div>

      {state.data.slice(0, 5).map((d) => (
        <div className="align-items-center d-flex d-parent flex-row lh-lg" key={d.referrerSite}>
          <div className="align-items-center d-flex flex-grow-1 flex-row pe-1 overflow-hidden">
            <Link
              className="text-body text-decoration-none text-decoration-underline-hover text-truncate"
              href={{ pathname: router.pathname, query: { ...router.query, referrerSite: d.referrerSite } }}
              scroll={false}
              title={d.referrerSite}
            >
              {d.referrerSite}
            </Link>

            <a
              className="d-parent-block flex-grow-0 flex-shrink-0 lh-1 ms-2 text-black text-primary-hover"
              href={d.referrerSite}
              rel="noreferrer"
              target="_blank"
              title="Go to the page"
            >
              <i className="bi-box-arrow-up-right h-1rem" />
            </a>
          </div>

          <div className="text-end ps-1 w-4rem" title={d.visitorPercentageDisplay}>{d.visitorCount}</div>
        </div>
      ))}
    </div>
  );
}
