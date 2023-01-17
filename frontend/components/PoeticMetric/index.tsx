import Script from "next/script";
import React, { useMemo } from "react";

export function PoeticMetric() {
  const src = useMemo<string | null>(() => {
    if (typeof window === "undefined" || window.poeticMetric === undefined) {
      return null;
    }

    return `${window.poeticMetric?.restApiBaseUrl}/pm.js`;
  }, []);

  return src === null ? null : (
    <Script async src={src} />
  );
}
