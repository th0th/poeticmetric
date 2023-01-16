import React, { useContext } from "react";
import { SiteReportsFiltersContext } from "../../../../contexts";
import { Name } from "./Name";
import { Version } from "./Version";

export function OperatingSystem() {
  const { operatingSystemName } = useContext(SiteReportsFiltersContext);

  return operatingSystemName === null ? (
    <Name />
  ) : (
    <Version />
  );
}
