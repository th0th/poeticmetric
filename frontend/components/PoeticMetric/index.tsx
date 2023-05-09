import Script from "next/script";
import React, { useMemo } from "react";
import { getRestApiUrl } from "../../helpers";

export function PoeticMetric() {
  const src = useMemo<string | null>(() => {
    return getRestApiUrl("/pm.js") || null;
  }, []);

  return src === null ? null : (
    <Script async src={src} />
  );
}
