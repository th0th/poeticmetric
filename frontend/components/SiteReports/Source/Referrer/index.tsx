import React, { useContext, useMemo } from "react";
import { SiteReportsFiltersContext } from "../../../../contexts";
import { Path } from "./Path";
import { Site } from "./Site";

export function Referrer() {
  const { referrerSite } = useContext(SiteReportsFiltersContext);

  const contentNode = useMemo<React.ReactNode>(() => referrerSite === null ? <Site /> : <Path />, [referrerSite]);

  return (
    <>{contentNode}</>
  );
}
