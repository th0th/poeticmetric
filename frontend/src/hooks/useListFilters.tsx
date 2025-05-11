import classNames from "classnames";
import { get, groupBy, values as _values } from "lodash-es";
import { ChangeEventHandler, JSX, PropsWithoutRef, ReactNode, useCallback, useMemo } from "react";
import { Dropdown } from "react-bootstrap";
import { useSearchParams } from "react-router";

type HydratedListFilter = Overwrite<ListFilter<any>, {
  options: Array<ListFilterOption>;
  values: Array<string>;
}>;

type ListFilter<T> = {
  dataBy: string | ((d: T) => string);
  dataDisplayBy: string | ((d: T) => string);
  name: string;
  searchParamName: string;
};

export type ListFilters = Array<ListFilter<any>>;

type ListFilterOption = {
  title: string;
  value: string;
};

type ListFiltersProps = Omit<PropsWithoutRef<JSX.IntrinsicElements["div"]>, "children">;

export default function useListFilters<T extends object>(
  data: Array<T> | null | undefined,
  filters: ListFilters,
  listFiltersProps?: ListFiltersProps,
): [ReactNode, Array<T>] {
  const [searchParams, setSearchParams] = useSearchParams();
  const hydratedData = useMemo<Array<T>>(() => data || [], [data]);

  const hydratedListFilters = useMemo<Array<HydratedListFilter>>(() => {
    return filters.map((filter) => {
      const options = _values(groupBy(hydratedData, filter.dataBy)).map((d) => ({
        title: typeof filter.dataDisplayBy === "string" ? get(d[0], filter.dataDisplayBy) : filter.dataDisplayBy(d[0]),
        value: typeof filter.dataBy === "string" ? get(d[0], filter.dataBy) : filter.dataBy(d[0]),
      }));

      const searchParamValues = searchParams.get(filter.searchParamName);
      const values = searchParamValues === null || searchParamValues === "" ? [] : searchParamValues.split(",");

      return { ...filter, options, values };
    });
  }, [hydratedData, filters, searchParams]);

  const filteredData = useMemo<Array<T>>(() => {
    return hydratedData.filter((d) => {
      for (const filter of hydratedListFilters) {
        if (filter.values.length === 0) {
          continue;
        }

        if (!filter.values.includes(typeof filter.dataBy === "string" ? get(d, filter.dataBy) : filter.dataBy(d))) {
          return false;
        }
      }

      return true;
    });
  }, [hydratedData, hydratedListFilters]);

  const handleFilterChange = useCallback<ChangeEventHandler<HTMLInputElement>>((event) => {
    const { checked, name, value } = event.target;
    const currentValue = searchParams.get(name);

    const valueSet: Set<string> = currentValue === null || currentValue === "" ? new Set() : new Set(currentValue.split(","));

    if (checked) {
      valueSet.add(value);
    } else {
      valueSet.delete(value);
    }

    let searchParamValue: string | null = null;

    if (valueSet.size > 0) {
      searchParamValue = Array.from(valueSet).join(",");
    }

    setSearchParams((s) => {
      if (searchParamValue === null) {
        s.delete(name);
      } else {
        s.set(name, searchParamValue);
      }

      s.sort();

      return s;
    }, { preventScrollReset: true });
  }, [searchParams, setSearchParams]);

  const reset = useCallback((searchParamName: string) => {
    setSearchParams((d) => {
      d.delete(searchParamName);

      return d;
    }, { preventScrollReset: true });
  }, [setSearchParams]);

  const listFilters = useMemo(() => {
    const { className, ...props } = listFiltersProps || {};

    const listFiltersToShow = hydratedListFilters.filter((d) => d.options.length > 1);

    return (
      listFiltersToShow.length > 0 ? (
        <div {...props} className={classNames("align-items-center d-flex flex-column flex-md-row gap-4", className)}>
          <div className="fs-7 fw-medium mt-0">Filters:</div>

          {listFiltersToShow.map((filter) => (
            <Dropdown autoClose="outside" className="w-100" key={filter.name}>
              <Dropdown.Toggle className="min-w-100" variant={filter.values.length > 0 ? "primary" : "outline-primary"}>
                {filter.name}
              </Dropdown.Toggle>

              <Dropdown.Menu className="min-w-100">
                {filter.options.map((option) => (
                  <Dropdown.Item
                    as="label"
                    className="gap-4 hstack"
                    key={option.title}
                  >
                    <input
                      checked={filter.values.includes(option.value)}
                      className="form-check-input mt-0"
                      name={filter.searchParamName}
                      onChange={handleFilterChange}
                      type="checkbox"
                      value={option.value}
                    />

                    <div className="gap-2 hstack">
                      {option.title}
                    </div>
                  </Dropdown.Item>
                ))}

                <div className="mt-2 px-8">
                  <button
                    className="btn btn-outline-primary btn-sm d-block w-100"
                    onClick={() => reset(filter.searchParamName)}
                    type="button"
                  >
                    Reset
                  </button>
                </div>
              </Dropdown.Menu>
            </Dropdown>
          ))}
        </div>
      ) : null
    );
  }, [handleFilterChange, hydratedListFilters, listFiltersProps, reset]);

  return [listFilters, filteredData];
}
