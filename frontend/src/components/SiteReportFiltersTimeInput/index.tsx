import dayjs from "dayjs";
import { Fragment, useCallback, useMemo, useState } from "react";
import { Dropdown, DropdownProps } from "react-bootstrap";
import DatePicker from "react-datepicker";
import { Link, useLocation, useSearchParams } from "react-router";
import useSiteReportData from "~/hooks/useSiteReportData";
import { getUpdatedLocation } from "~/lib/router";

export type SiteReportFiltersTimeInputProps = Omit<DropdownProps, "children">;

type State = {
  isDatePickerVisible: boolean;
  start?: Date;
};

type Option = {
  getEnd: () => dayjs.Dayjs;
  getStart: () => dayjs.Dayjs;
  title: string;
};

const options: Array<Array<Option>> = [
  [
    {
      getEnd: () => dayjs().add(1, "day").startOf("day"),
      getStart: () => dayjs().startOf("day"),
      title: "Today",
    },
    {
      getEnd: () => dayjs().startOf("day"),
      getStart: () => dayjs().subtract(1, "day").startOf("day"),
      title: "Yesterday",
    },
  ],
  [
    {
      getEnd: () => dayjs().add(1, "day").startOf("day"),
      getStart: () => dayjs().subtract(6, "day").startOf("day"),
      title: "Last 7 days",
    },
    {
      getEnd: () => dayjs().add(1, "day").startOf("day"),
      getStart: () => dayjs().subtract(29, "day").startOf("day"),
      title: "Last 30 days",
    },
  ],
  [
    {
      getEnd: () => dayjs().endOf("isoWeek").add(1, "day").startOf("day"),
      getStart: () => dayjs().startOf("isoWeek"),
      title: "This week",
    },
    {
      getEnd: () => dayjs().endOf("month").add(1, "day").startOf("day"),
      getStart: () => dayjs().startOf("month"),
      title: "This month",
    },
    {
      getEnd: () => dayjs().endOf("year").add(1, "day").startOf("day"),
      getStart: () => dayjs().startOf("year"),
      title: "This year",
    },
  ],
];

export default function SiteReportFiltersTimeInput({ ...props }: SiteReportFiltersTimeInputProps) {
  const location = useLocation();
  const [, setSearchParams] = useSearchParams();
  const [state, setState] = useState<State>({ isDatePickerVisible: false });
  const { filters: { end, start } } = useSiteReportData();

  const selectedOption = useMemo<Option | null>(
    () => options.flat().find((o) => o.getEnd().isSame(end) && o.getStart().isSame(start)) || null,
    [end, start],
  );

  const toggleBody = useMemo(() => {
    if (selectedOption === null) {
      return start.isSame(end, "day") ? start.format("MMM D") : `${start.format("MMM D")} - ${end.format("MMM D")}`;
    }

    return selectedOption.title;
  }, [end, selectedOption, start]);

  const handleCustomButtonClick = useCallback(() => setState((s) => ({ ...s, isDatePickerVisible: true })), []);

  const handleDatePickerChange = useCallback(async (date: [Date | null, Date | null]) => {
    const [ds, de] = date;

    if (ds === null) {
      return;
    }

    if (de === null) {
      setState((s) => ({ ...s, start: ds }));
    } else {
      if (de.getTime() === ds.getTime()) {
        return;
      }

      setSearchParams((s) => {
        s.set("end", de.toISOString());
        s.set("start", ds.toISOString() || de.toISOString());

        s.sort();

        return s;
      }, { preventScrollReset: true });

      setState((s) => ({ ...s, start: undefined }));
      document.body.click();
    }
  }, [setSearchParams]);

  return (
    <Dropdown {...props}>
      <Dropdown.Toggle as="button" className="btn btn-outline-primary w-100">{toggleBody}</Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((g) => (
          <Fragment key={g.map((o) => o.title).join("-")}>
            {g.map((o) => (
              <Dropdown.Item
                active={selectedOption?.title === o.title}
                as={Link}
                key={o.title}
                to={getUpdatedLocation(location, {
                  search: {
                    end: o.getEnd().toISOString(),
                    start: o.getStart().toISOString(),
                  },
                })}
              >
                {o.title}
              </Dropdown.Item>
            ))}

            <Dropdown.Divider />
          </Fragment>
        ))}

        <button className="dropdown-item" onClick={handleCustomButtonClick}>Custom</button>

        {state.isDatePickerVisible ? (
          <DatePicker
            calendarClassName="position-absolute start-md-100 top-100 top-md-0"
            endDate={state.start === undefined ? end.toDate() : undefined}
            inline
            locale="en-GB"
            maxDate={dayjs().add(1, "day").toDate()}
            onChange={handleDatePickerChange}
            selectsRange
            startDate={state.start || start.toDate()}
          />
        ) : null}
      </Dropdown.Menu>
    </Dropdown>
  );
}
