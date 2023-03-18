import { omit, toLower, upperFirst } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useMemo } from "react";
import { Dropdown, DropdownProps } from "react-bootstrap";
import { SiteReportsContext, SiteReportsContextValue } from "../../../contexts";

export type FiltersProps = Omit<DropdownProps, "children">;

type State = {
  filters: Array<StateFilter>;
};

type StateFilter = {
  key: Exclude<keyof SiteReportsContextValue["filters"], "end" | "siteId" | "start">;
  keyDisplay: string;
  value: string;
};

const stateFilterKeyDisplays: Record<StateFilter["key"], string> = {
  browserName: "Browser",
  browserVersion: "Browser version",
  countryIsoCode: "Country",
  deviceType: "Device",
  language: "Language",
  operatingSystemName: "Operating system",
  operatingSystemVersion: "Operating system version",
  path: "Page",
  referrer: "Referer",
  referrerSite: "Referrer site",
  utmCampaign: "UTM campaign",
  utmContent: "UTM content",
  utmMedium: "UTM medium",
  utmSource: "UTM source",
  utmTerm: "UTM term",
};

export function Filters({ ...props }: FiltersProps) {
  const router = useRouter();
  const { filters } = useContext(SiteReportsContext);

  const state = useMemo<State>(() => {
    const stateFilters: State["filters"] = [];

    (Object.keys(filters) as Array<keyof typeof filters>)
      .forEach((key) => {
        if (key === "end" || key === "siteId" || key === "start") {
          return;
        }

        let value = filters[key];

        if (value !== null) {
          if (key === "deviceType") {
            value = upperFirst(toLower(value));
          }

          stateFilters.push({ key, keyDisplay: stateFilterKeyDisplays[key], value });
        }
      });

    return { filters: stateFilters };
  }, [filters]);

  return state.filters.length === 0 ? null : (
    <Dropdown {...props}>
      <Dropdown.Toggle as="button" className="btn btn-outline-primary">
        Filters
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {state.filters.map((f) => (
          <div className="align-items-center d-flex flex-row fs-sm dropdown-item-text dropdown-item" key={f.key}>
            <div className="flex-grow-1">
              <span className="fw-medium">{`${f.keyDisplay}: `}</span>

              {f.value}
            </div>

            <Link className="flex-shrink-0 ms-3 link-danger" href={{ pathname: router.pathname, query: omit(router.query, f.key) }}>
              <i className="bi bi-x-circle-fill" />
            </Link>
          </div>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}
