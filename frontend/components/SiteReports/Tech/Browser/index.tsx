import React, { useContext } from "react";
import { SiteReportsContext } from "../../../../contexts";
import { Name } from "./Name";
import { Version } from "./Version";

export function Browser() {
  const { browserName } = useContext(SiteReportsContext).filters;

  return browserName === null ? (
    <Name />
  ) : (
    <Version />
  );
}
