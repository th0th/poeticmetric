import React, { useContext } from "react";
import { SiteReportsFiltersContext } from "../../../contexts";
import { Name } from "./Name";
import { Version } from "./Version";

export function Browser() {
  const { browserName } = useContext(SiteReportsFiltersContext);

  return browserName === null ? (
    <Name />
  ) : (
    <Version />
  );
}
