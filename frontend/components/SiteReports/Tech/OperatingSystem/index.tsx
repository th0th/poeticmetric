import React, { useContext } from "react";
import { SiteReportsContext } from "../../../../contexts";
import { Name } from "./Name";
import { Version } from "./Version";

export function OperatingSystem() {
  const { operatingSystemName } = useContext(SiteReportsContext).filters;

  return operatingSystemName === null ? (
    <Name />
  ) : (
    <Version />
  );
}
