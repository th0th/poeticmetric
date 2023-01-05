import Script from "next/script";
import React, { useMemo } from "react";

export function PoeticMetric() {
  const src = useMemo<string>(() => `${process.env.NEXT_PUBLIC_POETICMETRIC_REST_API_BASE_URL}/pm.js`, []);

  return (
    <Script async src={src} />
  );
}
