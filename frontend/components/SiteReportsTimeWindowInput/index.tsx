import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useContext, useMemo } from "react";
import { Dropdown } from "react-bootstrap";
import { SiteReportsFiltersContext } from "../../contexts";

type Option = {
  getEnd: () => dayjs.Dayjs;
  getStart: () => dayjs.Dayjs;
  title: string;
};

const options: Array<Array<Option>> = [
  [
    {
      getEnd: () => dayjs().endOf("day"),
      getStart: () => dayjs().startOf("day"),
      title: "Today",
    },
    {
      getEnd: () => dayjs().subtract(1, "day").endOf("day"),
      getStart: () => dayjs().subtract(1, "day").startOf("day"),
      title: "Yesterday",
    },
  ],
  [
    {
      getEnd: () => dayjs().endOf("day"),
      getStart: () => dayjs().subtract(6, "day").startOf("day"),
      title: "Last 7 days",
    },
    {
      getEnd: () => dayjs().endOf("day"),
      getStart: () => dayjs().subtract(29, "day").startOf("day"),
      title: "Last 30 days",
    },
  ],
  [
    {
      getEnd: () => dayjs().endOf("isoWeek"),
      getStart: () => dayjs().startOf("isoWeek"),
      title: "This week",
    },
    {
      getEnd: () => dayjs().endOf("day"),
      getStart: () => dayjs().startOf("month"),
      title: "This month",
    },
    {
      getEnd: () => dayjs().endOf("day"),
      getStart: () => dayjs().startOf("year"),
      title: "This year",
    },
  ],
  [
    {
      getEnd: () => dayjs().subtract(1, "month").endOf("month"),
      getStart: () => dayjs().subtract(4, "month").startOf("month"),
      title: "Last 3 months",
    },
    {
      getEnd: () => dayjs().subtract(1, "month").endOf("month"),
      getStart: () => dayjs().subtract(7, "month").startOf("month"),
      title: "Last 6 months",
    },
  ],
];

export function SiteReportsTimeWindowInput() {
  const router = useRouter();
  const { start, end } = useContext(SiteReportsFiltersContext);

  const selectedOption = useMemo<Option | null>(
    () => options.flat().find((o) => o.getEnd().isSame(end) && o.getStart().isSame(start)) || null,
    [end, start],
  );

  const toggleBody = useMemo<React.ReactNode>(() => {
    if (selectedOption === null) {
      return start.isSame(end, "day") ? start.format("MMM D") : `${start.format("MMM D")} - ${end.format("MMM D")}`;
    }

    return selectedOption.title;
  }, [end, selectedOption, start]);

  return (
    <Dropdown>
      <Dropdown.Toggle>
        {toggleBody}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((g) => (
          <React.Fragment key={g.map((o) => o.title).join("-")}>
            {g.map((o) => (
              <Dropdown.Item
                active={selectedOption?.title === o.title}
                as={(props) => (
                  <Link
                    {...props}
                    href={{
                      pathname: router.pathname,
                      query: {
                        ...router.query,
                        end: o.getEnd().toISOString(),
                        start: o.getStart().toISOString(),
                      },
                    }}
                  />
                )}
                key={o.title}
              >
                {o.title}
              </Dropdown.Item>
            ))}

            <Dropdown.Divider />
          </React.Fragment>
        ))}

        <Link className="dropdown-item" href="/">Custom</Link>
      </Dropdown.Menu>
    </Dropdown>
  );
}
