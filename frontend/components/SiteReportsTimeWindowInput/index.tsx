import dayjs from "dayjs";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useCallback, useContext, useMemo, useState } from "react";
import { Dropdown } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { SiteReportsFiltersContext } from "../../contexts";

type Option = {
  getEnd: () => dayjs.Dayjs;
  getStart: () => dayjs.Dayjs;
  title: string;
};

type State = {
  isDatePickerVisible: boolean;
  start?: Date;
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
  const [state, setState] = useState<State>({ isDatePickerVisible: false });

  const selectedOption = useMemo<Option | null>(
    () => options.flat().find((o) => o.getEnd().isSame(end) && o.getStart().isSame(start)) || null,
    [end, start],
  );

  const handleToggle = useCallback((nextShow: boolean) => {
    if (!nextShow) {
      setState((s) => ({ ...s, isDatePickerVisible: false }));
    }
  }, []);

  const handleCustomButtonClick = useCallback(() => setState((s) => ({ ...s, isDatePickerVisible: true })), []);

  const handleDatePickerChange = useCallback(async (
    date: [Date | null, Date | null],
  ) => {
    const [ds, de] = date;

    if (de === null) {
      setState((s) => ({ ...s, start: ds || undefined }));
    } else {
      await router.push({
        pathname: router.pathname,
        query: {
          ...router.query,
          end: dayjs(de).endOf("day").toISOString(),
          start: dayjs(ds).toISOString(),
        },
      });

      setState((s) => ({ ...s, start: undefined }));
      window.document.body.click();
    }
  }, [router]);

  const toggleBody = useMemo<React.ReactNode>(() => {
    if (selectedOption === null) {
      return start.isSame(end, "day") ? start.format("MMM D") : `${start.format("MMM D")} - ${end.format("MMM D")}`;
    }

    return selectedOption.title;
  }, [end, selectedOption, start]);

  return (
    <Dropdown onToggle={handleToggle}>
      <Dropdown.Toggle as="button" className="btn btn-outline-primary">
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

        <button className="dropdown-item" onClick={handleCustomButtonClick}>Custom</button>

        {state.isDatePickerVisible ? (
          <DatePicker
            calendarClassName="position-absolute start-md-100 top-100 top-md-0"
            endDate={state.start === undefined ? end.toDate() : undefined}
            inline
            locale="en-GB"
            maxDate={new Date()}
            onChange={handleDatePickerChange}
            selectsRange
            startDate={state.start || start.toDate()}
          />
        ) : null}
      </Dropdown.Menu>
    </Dropdown>
  );
}
