import { IconCircleXFilled } from "@tabler/icons-react";
import { useMemo } from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useLocation, useSearchParams } from "wouter";
import useSiteReportData from "~/hooks/useSiteReportData";
import { getUpdatedSearch } from "~/lib/router";

type Filter = {
  key: string;
  keyDisplay: string;
  value: string;
};

const filterKeyDisplays: Record<Filter["key"], string> = {
  browserName: "Browser",
  browserVersion: "Browser version",
  countryISOCode: "Country",
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

export default function Filters() {
  const [location] = useLocation();
  const [searchParams] = useSearchParams();
  const { filters: allFilters } = useSiteReportData();

  const filters = useMemo<Array<Filter>>(() => {
    const f: Array<Filter> = [];

    Object.entries(allFilters).forEach(([key, value]) => {
      const keyDisplay = filterKeyDisplays[key];

      if (keyDisplay && value) {
        f.push({ key, keyDisplay, value: value.toString() });
      }
    });

    return f;
  }, [allFilters]);

  const unfilteredLink = useMemo(() => {
    const searchParamsUpdate: Record<string, null> = {};
    Object.keys(filterKeyDisplays).map((k) => {
      searchParamsUpdate[k] = null;
    });

    return `${location}${getUpdatedSearch(searchParams, searchParamsUpdate)}`;
  }, [location, searchParams]);

  return filters.length > 0 ? (
    <Dropdown autoClose="outside">
      <Dropdown.Toggle as="button" className="btn btn-outline-primary w-100">Filters</Dropdown.Toggle>

      <Dropdown.Menu>
        {filters.map((d) => (
          <Dropdown.Item as="div" className="align-items-center d-flex gap-6 justify-content-between" key={d.key}>
            <div>
              <span className="fw-medium">{d.keyDisplay}:{" "}</span>
              {d.value}
            </div>

            <Link
              className="flex-grow-0 flex-shrink-0 link-danger"
              href={`${location}${getUpdatedSearch(searchParams, { [d.key]: null })}`}
            >
              <IconCircleXFilled size="1.4em" />
            </Link>
          </Dropdown.Item>
        ))}

        <div className="mt-4 mx-8 text-center">
          <Link className="btn btn-primary btn-sm" href={unfilteredLink}>Clear all filters</Link>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  ) : null;
}
